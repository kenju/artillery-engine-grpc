const A = require('async')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const debug = require('debug')('engine:grpc')

const { log: logger } = console

function ArtilleryGRPCEngine(script, ee, helpers) {
  this.script = script
  this.ee = ee
  this.helpers = helpers

  const { config } = this.script
  debug('script.config=%O', config)

  // Hash<K, V>: K=target, V=grPC client
  this.serviceClient = this.loadServiceClient(config)
  const client = this.initGRPCClient(config.target)
  this.clientHash = {
    [config.target]: client,
  }

  return this
}

ArtilleryGRPCEngine.prototype.loadServiceClient = function initClient(config) {
  const {
    protobufDefinition,
    protoLoaderConfig,
  } = config.engines.grpc

  debug('protobufDefinition=%O', protobufDefinition)
  debug('protoLoaderConfig=%O', protoLoaderConfig)

  const {
    filepath,
    service,
    package,
  } = protobufDefinition

  // @return GrpcObject
  function loadPackageDefinition() {
    const packageDefinition = protoLoader.loadSync(
      filepath,
      protoLoaderConfig || {},
    )
    return grpc.loadPackageDefinition(packageDefinition)
  }

  const grpcObject = loadPackageDefinition()
  const packages = package.split('.')
  const services = packages.reduce((obj, p) => obj = obj[p], grpcObject)
  return services[service]
}

ArtilleryGRPCEngine.prototype.initGRPCClient = function initClient(target) {
  const { channelOpts } = this.script.config.engines.grpc
  /**
   * Filter out invalid channelOpts for gRPC client.
   * Channel third argument must be "an object with string keys and integer or string values"
   *
   * @see https://github.com/kenju/artillery-engine-grpc/pull/8/files#issuecomment-594329331
   */
  const opts = Object.keys(channelOpts).reduce((acc, k) => {
    if (typeof channelOpts[k] === "string" || typeof channelOpts[k] === "number") {
      acc[k] = channelOpts[k]
    }
    return acc
  }, {})
  return new this.serviceClient(target, grpc.credentials.createInsecure(), opts)
}

ArtilleryGRPCEngine.prototype.createScenario = function createScenario(scenarioSpec, ee) {
  const tasks = scenarioSpec.flow.map((ops) => this.step(ops, ee, scenarioSpec))

  return this.compile(tasks, scenarioSpec.flow, ee)
}

ArtilleryGRPCEngine.prototype.step = function step(ops, ee, scenarioSpec) {
  if (ops.log) {
    return (context, callback) => {
      logger(this.helpers.template(ops.log, context))
      return process.nextTick(() => { callback(null, context) })
    }
  }

  const startedAt = process.hrtime()

  function recordMetrics(startedAt, error) {
    ee.emit('counter', 'engine.grpc.responses.total', 1)
    if (error) {
      ee.emit('counter', 'engine.grpc.responses.error', 1)
    } else {
      ee.emit('counter', 'engine.grpc.responses.success', 1)
    }

    /** @doc https://nodejs.org/api/process.html#process_process_hrtime_time */
    const [diffSec, diffNanosec] = process.hrtime(startedAt)
    const deltaNanosec = (diffSec * 1e9) + diffNanosec // NOTE: 1e9 means 1 * 10 to the 9th power, which is 1 billion (1000000000).
    const deltaMillisec = deltaNanosec / 1e6 // NOTE: 1e6 means 1 * 10 to the 6th power, which is 1 million (1000000).
    ee.emit('histogram', 'engine.grpc.response_time', deltaMillisec)
  }

  function beforeRequestHook(context, config, scenarioSpec) {
    if (!scenarioSpec.beforeRequest) { return; }

    // call beforeRequest hooks
    Array.from(scenarioSpec.beforeRequest).forEach((functionName) => {
      const f = config.processor[functionName]
      if (f) { f(context) }
    })
  }

  // gRPC request
  return gRPCRequest = (context, callback) => {
    beforeRequestHook(context, this.script.config, scenarioSpec)

    const target = context.vars.target
    let client = this.clientHash[target]
    if (!client) {
      client = this.initGRPCClient(target)
      this.clientHash[target] = client // memoize
    }

    Object.keys(ops).map((rpcName) => {
      const args = ops[rpcName]
      client[rpcName](args, (error, response) => {

        recordMetrics(startedAt, error)

        if (error) {
          ee.emit('error', error)
          return callback(error, context)
        } else {
          return callback(null, context)
        }
      })
    })
  }
}

ArtilleryGRPCEngine.prototype.compile = function compile(tasks, scenarioSpec, ee) {
  return function scenario(initialContext, callback) {
    const init = function init(next) {
      ee.emit('started')
      return next(null, initialContext)
    }

    const steps = [init].concat(tasks)

    A.waterfall(
      steps,
      function done(err, context) {
        if (err) {
          debug(err)
        }

        return callback(err, context)
      }
    )
  }
}

module.exports = ArtilleryGRPCEngine
