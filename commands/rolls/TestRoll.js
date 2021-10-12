const RollCommand = require("./Roll")
const Discord = require("discord.js")


module.exports = class TestRollCommand extends RollCommand {
  static aliases = ["TestRoll", "Test", "T"]
  static description = "Every roll has a Test variation. You don't need to be a player. e.g. `TRollDX`"

  needsGame = false
  playerOnly = false
  canDelete = true
  saveRollOrReturnWarning() {}

  isTest = true
}