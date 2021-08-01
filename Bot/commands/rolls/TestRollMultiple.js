const RollMultipleCommand = require("./RollMultiple")
const BaseRollCommand = require("../roll_command")

module.exports = class TestRollMultipleCommand extends RollMultipleCommand {
  static aliases = ["TestRollX", "TestX", "TX"]
  needsGame = false
  playerOnly = false
  canDelete = true
  
  isTest = true
  
  saveMultipleRollsOrReturnWarning() {}
}