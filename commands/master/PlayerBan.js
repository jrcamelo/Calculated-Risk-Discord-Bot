const BaseCommand = require("../base_command")

module.exports = class PlayerBanCommand extends BaseCommand {
  static aliases = ["Ban", "Purge"]
  static description = "Removes a player from the game."
  static argsDescription = "<@User> | Just a User ID if can't ping"
  static category = "Master"

  canDelete = false
  masterOnly = true
  acceptAdmins = true
  acceptModerators = true
  acceptAdmins = true

  needsGame = true
  needsMention = true
  acceptsPlayerNotInServer = true
  needsMentionedPlayer = true
  
  canMention = true

  async execute() {
    this.turn.banPlayer(this.mentionedPlayer)
    this.game.addToBanList(this.mentionedPlayer.id)
    if (this.saveOrReturnWarning()) return
    this.sendReply(`${this.mentionedPlayer.ping()} has been removed.`)
  }
}