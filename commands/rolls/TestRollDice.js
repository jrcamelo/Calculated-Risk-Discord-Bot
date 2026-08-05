const RollDiceCommand = require("./RollDice")

module.exports = class TestRollDiceCommand extends RollDiceCommand {
  static aliases = ["TestRollDice", "TestD", "TD"]
  static description = "Roll with a specified limit. 10¹¹ is the maximum value. (Aliases: TestD, TD)"
  needsGame = false
  playerOnly = false
  canDelete = true

  isTest = true

  saveRollOrReturnWarning() {}
}
