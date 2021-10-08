const RollDiceCommand = require("./RollDice")

module.exports = class TestRollDiceCommand extends RollDiceCommand {
  static aliases = ["TestRollDice", "TestD", "TD"]
  needsGame = false
  playerOnly = false
  canDelete = true

  isTest = true

  saveRollOrReturnWarning() {}
}