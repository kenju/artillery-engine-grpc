const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

function ArtilleryGRPCEngine(script, ee, helpers) {
  this.script = script
  this.ee = ee
  this.helpers = helpers

  const { config } = this.script
  const { target, engines } = config
  const {
    filepath,
    service,
    package,
  } = engines.grpc.protobufDefinition

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

  function initClient() {
    const grpcObject = loadPackageDefinition()
    // TODO: make it meta programming
    console.log('#initialized')
    const client = new grpcObject.backend.services.v1[service](
      target,
      grpc.credentials.createInsecure(),
    )
    return client
  }
  this.client = initClient()

  return this
}

ArtilleryGRPCEngine.prototype.createScenario = function createScenario(scenarioSpec, ee) {
  function executeScenario() {
    ee.emit('started')

    ee.emit('done')
  }

  console.log('#createScenario')
  console.log(scenarioSpec)

  scenarioSpec.flow.forEach((flow) => {
    Object.keys(flow).forEach((rpcName) => {
      const args = flow[rpcName]
      this.client[rpcName](args, (error, response) => {
        if (error) {
          console.error(error)
        } else {
          console.log(response)
        }
      })
    })
  })

  return executeScenario
}

module.exports = ArtilleryGRPCEngine
