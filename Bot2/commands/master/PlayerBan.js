const BaseCommand = require("../base_command")

module.exports = class PlayerBanCommand extends BaseCommand {
  static aliases = ["Ban", "Purge"]
  static description = "Removes a player from the game."
  static argsDescription = "<@User>"

  canDelete = false
  masterOnly = true
  acceptAdmins = true

  needsGame = true
  needsMention = true
  acceptsPlayerNotInServer = true
  needsMentionedPlayer = true
  
  canMention = true

  async execute() {
    this.turn.banPlayer(this.mentionedPlayer)
    if (this.saveOrReturnWarning) return
    this.sendReply(`${this.mentionedPlayer.ping()} has been removed.`)
  }
}