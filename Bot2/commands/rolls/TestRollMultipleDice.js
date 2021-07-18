const RollMultipleDiceCommand = require("./RollMultipleDice")

module.exports = class TestRollMultipleDiceCommand extends RollMultipleDiceCommand {
  static aliases = ["TestRollXD", "TestXD", "TXD"]
  needsGame = false
  playerOnly = false
  canDelete = true
  
  isTest = true
  
  saveMultipleRollsOrReturnWarning() {}
}