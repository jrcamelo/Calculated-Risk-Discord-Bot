const RollDiceMultipleCommand = require("./RollDiceMultiple")

module.exports = class TestRollDiceMultipleCommand extends RollDiceMultipleCommand {
  static aliases = ["TestRollDX", "TestDX", "TDX"]
  static description = "Do multiple rolls with a limit. `RollDX` also works (Aliases: TestDX, TDX)"
  needsGame = false
  playerOnly = false
  canDelete = true

  isTest = true
  
  saveRollOrReturnWarning() {}
}
