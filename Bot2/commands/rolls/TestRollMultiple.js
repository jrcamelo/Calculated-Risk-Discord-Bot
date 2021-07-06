const RollMultipleCommand = require("./RollMultiple")

module.exports = class TestRollMultipleCommand extends RollMultipleCommand {
  static aliases = ["TestRollX", "TestX", "TX"]
  needsGame = false
  playerOnly = false
  canDelete = true
  saveMultipleRollsOrReturnWarning() {}
}