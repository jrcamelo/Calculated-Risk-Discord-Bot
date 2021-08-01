const RollCommand = require("./Roll")
const Discord = require("discord.js")


module.exports = class TestRollCommand extends RollCommand {
  static aliases = ["TestRoll", "Test", "T"]
  static description = "Every roll also has a Test variation, where you don't even need to be a player to use. Just add a T before the roll command."

  needsGame = false
  playerOnly = false
  canDelete = true
  saveRollOrReturnWarning() {}

  isTest = true
}