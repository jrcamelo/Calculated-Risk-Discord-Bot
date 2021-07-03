const BaseCommand = require("../base_command")

module.exports = class PlayerKickCommand extends BaseCommand {
  static aliases = ["Kick"]
  static description = "Removes a player from the game on the next turn."
  static argsDescription = "<@User>"

  canDelete = false
  masterOnly = true
  acceptAdmins = true
  acceptModerators = true

  needsGame = true
  needsMention = true
  acceptsPlayerNotInServer = true
  needsMentionedPlayer = true
  
  canMention = true

  async execute() {
    this.turn.kickPlayer(this.mentionedPlayer)
    if (this.saveOrReturnWarning) return
    this.sendReply(`${this.mentionedPlayer.ping()} has fallen and will be removed next turn.`)
  }
}