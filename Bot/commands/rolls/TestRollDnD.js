const RollDnDCommand = require("./RollDnD")

module.exports = class TestRollDnDCommand extends RollDnDCommand {
  static aliases = ["TestRollDnD", "TestDnD", "TDnD"]
  needsGame = false
  playerOnly = false
  canDelete = true

  isTest = true

  saveRollOrReturnWarning() {}
}