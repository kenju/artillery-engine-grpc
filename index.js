function ArtilleryGRPCEngine(script, ee, helpers) {
  this.script = script;
  this.ee = ee;
  this.helpers = helpers;

  return this;
}

ArtilleryGRPCEngine.prototype.createScenario = function createScenario(scenarioSpec, ee) {
  function executeScenario() {
    ee.emit('started');
    ee.emit('done');
  }
  return executeScenario;
}

module.exports = ArtilleryGRPCEngine;
