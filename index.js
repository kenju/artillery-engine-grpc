const A = require('async');
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const { log: logger } = console

function ArtilleryGRPCEngine(script, ee, helpers) {
  this.script = script
  this.ee = ee
  this.helpers = helpers

  const { config } = this.script
  this.client = this.initGRPCClient(config)

  return this
}

ArtilleryGRPCEngine.prototype.initGRPCClient = function initClient(config) {
  const { target, engines } = config
  const { filepath, service, package, } = engines.grpc.protobufDefinition

  // @return GrpcObject
  function loadPackageDefinition() {
    const packageDefinition = protoLoader.loadSync(
      filepath,
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    )
    return grpc.loadPackageDefinition(packageDefinition)
  }

  function getServiceClient() {
    const grpcObject = loadPackageDefinition()
    const packages = package.split('.')
    const services = packages.reduce((obj, p) => obj = obj[p], grpcObject)
    return services[service]
  }

  const serviceClient = getServiceClient()
  return new serviceClient(target, grpc.credentials.createInsecure())
}

ArtilleryGRPCEngine.prototype.createScenario = function createScenario(scenarioSpec, ee) {
  const tasks = scenarioSpec.flow.map((ops) => this.step(ops, ee))

  return this.compile(tasks, scenarioSpec.flow, ee)
}

ArtilleryGRPCEngine.prototype.step = function step(ops, ee) {
  if (ops.log) {
    return (context, callback) => {
      logger(this.helpers.template(ops.log, context))
      return process.nextTick(() => { callback(null, context); });
    };
  }

  // gRPC request
  return gRPCRequest = (context, callback) => {
    Object.keys(ops).map((rpcName) => {
      const args = ops[rpcName]
      this.client[rpcName](args, (error, response) => {
        if (error) {
          ee.emit('error', error)
          return callback(err, context);
        } else {
          ee.emit('response', response)
          return callback(null, context);
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
