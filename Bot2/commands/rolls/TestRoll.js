const RollCommand = require("./Roll")
const Discord = require("discord.js")


module.exports = class TestRollCommand extends RollCommand {
  static aliases = ["TestRoll", "Test", "T"]
  needsGame = false
  playerOnly = false
  canDelete = true
  saveRollOrReturnWarning() {}

  // TODO: Make presenter work without a master or a player
}