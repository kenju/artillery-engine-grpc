const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

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
  const executeScenario = () => {
    ee.emit('started')

    scenarioSpec.flow.forEach((flow) => {
      Object.keys(flow).forEach((rpcName) => {
        const args = flow[rpcName]
        this.client[rpcName](args, (error, response) => {
          if (error) {
            ee.emit('error', error)
          } else {
            ee.emit('response', response)
          }
        })
      })
    })

    ee.emit('done')
  }
  return executeScenario
}

module.exports = ArtilleryGRPCEngine
