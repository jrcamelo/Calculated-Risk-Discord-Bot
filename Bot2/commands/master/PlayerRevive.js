const BaseCommand = require("../base_command")

module.exports = class PlayerReviveCommand extends BaseCommand {
  static aliases = ["Revive"]
  static description = "Revives a dead player."
  static argsDescription = "<@User>"

  canDelete = false
  masterOnly = true

  needsGame = true
  needsMention = true
  needsMentionedPlayer = true
  
  canMention = true

  async execute() {
    this.turn.revivePlayer(this.mentionedPlayer)
    if (this.saveOrReturnWarning()) return
    this.sendReply(`${this.mentionedPlayer.ping()} has fallen and will be removed next turn.`)
  }
}