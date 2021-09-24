const BaseCommand = require("../base_command")

module.exports = class PlayerKickCommand extends BaseCommand {
  static aliases = ["Kick"]
  static description = "Removes a player from the game on the next turn."
  static argsDescription = "<@User>"
  static category = "Master"

  canDelete = false
  masterOnly = true
  acceptModerators = true
  acceptAdmins = true

  needsGame = true
  needsMention = true
  acceptsPlayerNotInServer = true
  needsMentionedPlayer = true
  
  canMention = true

  async execute() {
    if (this.mentionedPlayer.removed) {
      return this.replyDeletable(`Kicking ${this.mentionedPlayer.name || this.mentionedPlayer.username}'s corpse will lead nowhere, try purging instead.`)
    } 
    this.turn.kickPlayer(this.mentionedPlayer)
    if (this.saveOrReturnWarning()) return
    this.sendReply(`${this.mentionedPlayer.ping()} has fallen and will be removed next turn.`)
  }
}