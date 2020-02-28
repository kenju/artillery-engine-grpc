const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

function ArtilleryGRPCEngine(script, ee, helpers) {
  this.script = script
  this.ee = ee
  this.helpers = helpers

  console.log('#constructor')
  const { config } = this.script
  const { target, engines } = config
  console.log(engines.grpc)
  const packageDefinition = protoLoader.loadSync(
    engines.grpc.protobufDefinition,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
  )
  const proto = grpc.loadPackageDefinition(packageDefinition)

  // TODO: make it meta programming
  const client = new proto.backend.services.v1.HelloService(
    target,
    grpc.credentials.createInsecure(),
  )
  this.client = client

  return this
}

ArtilleryGRPCEngine.prototype.createScenario = function createScenario(scenarioSpec, ee) {
  function executeScenario() {
    ee.emit('started')
    ee.emit('done')
  }
  console.log('#createScenario')
  console.log(scenarioSpec)

  // TODO: execute based on flow
  console.log('sending gRPC requect')
  this.client.Hello({ id: 1, name: 'Alice' }, (error, response) => {
    if (!error) {
      console.log(response.message)
    } else {
      console.error(error)
    }
  })

  return executeScenario
}

module.exports = ArtilleryGRPCEngine
