const TestRollCommand = require("./TestRoll")

module.exports = class TestJokeRollPizzaCommand extends TestRollCommand {
  static aliases = ["PizzaRoll", "Pizza"]
  needsGame = false
  playerOnly = false
  canDelete = true
  saveRollOrReturnWarning() {}

  limit = 8
  isTest = true
}