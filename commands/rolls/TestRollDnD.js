const RollDnDCommand = require("./RollDnD")

module.exports = class TestRollDnDCommand extends RollDnDCommand {
  static aliases = ["TestRollDnD", "TestDnD", "TDnD"]
  static description = "Roll using DnD notation. If multiple rolls, the result is the sum. (Aliases: TestDnD, TDnD)"
  needsGame = false
  playerOnly = false
  canDelete = true

  isTest = true

  saveRollOrReturnWarning() {}
}
