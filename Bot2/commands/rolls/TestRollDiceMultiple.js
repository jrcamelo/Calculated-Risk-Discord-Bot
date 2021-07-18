const RollDiceMultipleCommand = require("./RollDiceMultiple")

module.exports = class TestRollDiceMultipleCommand extends RollDiceMultipleCommand {
  static aliases = ["TestRollDX", "TestDX", "TDX"]
  needsGame = false
  playerOnly = false
  canDelete = true

  isTest = true
  
  saveRollOrReturnWarning() {}
}