const BaseCommand = require("../base_command")
const { makeMessageLink } = require("../../utils/discord");
module.exports = class PlayerCedeCommand extends BaseCommand {
  static aliases = ["Cede", "Send"]
  static description = "Cede lands to another player."
  static argsDescription = "<@User> <Message>"
  static category = "Player"

  canDelete = false
  needsGame = true
  aliveOnly = true
  needsMention = true
  canMention = false
  ignoreFirstArg = true

  async execute() {
    this.changes = false
    let success = false
    let text = ""
    for (let mentionedUser of this.getMentionedUsers()) {
      if (!mentionedUser) continue
      const mentionedPlayer = this.turn.getPlayer(mentionedUser)
      if (!mentionedPlayer) {
        text += this.userNotInGame(mentionedUser)
      } else {
        text += this.cedeToPlayer(mentionedPlayer)
        this.turn.addCede(text);
        success = true
      }
      break
    }
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "Error")
    if (success) this.turn.addCedeMessage(makeMessageLink(this.reply))
  }

  cedeToPlayer(mentionedPlayer) {
    if (!this.args && this.attachment != null) return `${this.player.pingWithFaction()} cedes nothing to ${mentionedPlayer.pingWithFaction()}.`
    return `${this.player.pingWithFaction()} cedes the following to ${mentionedPlayer.pingWithFaction()}:\n` + this.arg + " " + (this.attachment || "")
  }
  
  userNotInGame(user) {
    return `${user} is not in the game.\n`
  }
}