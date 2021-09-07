const BaseCommand = require("../base_command")
const emotes = require("../../utils/emotes")

module.exports = class PlayerKillCommand extends BaseCommand {
  static aliases = ["Kill"]
  static description = "Kills a player. Use `Revive` to correct your mistakes."
  static argsDescription = "<@User>"
  static category = "Master"

  canDelete = false
  masterOnly = true

  needsGame = true
  needsMention = true
  needsMentionedPlayer = true
  
  canMention = true

  async execute() {
    if (!this.mentionedPlayer.alive)
      return this.sendReply(`Stop! Stop! They're already dead!.`)

    this.turn.killPlayer(this.mentionedPlayer)
    if (this.saveOrReturnWarning()) return
    await this.sendReply(`${this.mentionedPlayer.ping()} is no more. Press ${emotes.fReactionEmoji} to pay respects.`)
    this.reply.react(emotes.fReactionEmoji);
  }
}