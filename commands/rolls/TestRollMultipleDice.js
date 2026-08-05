const RollMultipleDiceCommand = require("./RollMultipleDice")

module.exports = class TestRollMultipleDiceCommand extends RollMultipleDiceCommand {
  static aliases = ["TestRollXD", "TestXD", "TXD"]
  static description = "Do multiple rolls with a limit. `RollDX` also works (Aliases: TestXD, TXD)"
  needsGame = false
  playerOnly = false
  canDelete = true
  
  isTest = true
  
  saveMultipleRollsOrReturnWarning() {}
}
