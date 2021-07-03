const BaseCommand = require("../base_command")

module.exports = class ClaimCommand extends BaseCommand {
  static aliases = ["Claim", "Join", "Rename"]
  static description = "Joins the current game as a player or rename your faction."
  static argsDescription = "[Faction name]"

  canDelete = false

  needsGame = true  
  canMention = true
  shouldCleanArgsLineBreaks = false

  async execute() {
    const existingPlayerName = this.player ? this.player.name : ""
    this.turn.addPlayer(this.user, this.arg)
    const newPlayer = this.turn.getPlayer(this.mentionedUser)
    if (saveOrReturnWarning()) return
    this.sendReply(existingPlayerName
          ? `${existingPlayerName} has been changed to ${newPlayer.name || "[Blank]"}`
          : `${newPlayer.pingWithFaction()} has joined!`)
  }
}