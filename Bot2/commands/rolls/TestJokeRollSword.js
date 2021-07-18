const TestRollCommand = require("./TestRoll")

module.exports = class TestJokeRollSwordCommand extends TestRollCommand {
  static aliases = ["AttackWithMySword", "Sword"]
  needsGame = false
  playerOnly = false
  canDelete = true
  saveRollOrReturnWarning() {}

  limit = 20
  arg = "Attack with my sword"
  isTest = true

  // TODO: Make presenter work without a master or a player
}