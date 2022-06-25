const BaseCommand = require("../base_command")
module.exports = class PlayerForceBetrayCommand extends BaseCommand {
  static aliases = ["ForceBetray"]
  static description = "Breaks an alliance between players. `r.ForceBreak` for NAPs"
  static argsDescription = "<@User> <@OtherUser>"
  static category = "Master"

  canDelete = false
  needsGame = true
  masterOnly = true
  needsMention = true
  needsMentionedPlayer = true
  canMention = false

  async execute() {
    this.changes = false
    let text = ""
    if (this.getMentionedUsers().length != 2) {
      text = "You need to mention two players."
    } else {
        const mentionedFirstPlayer = this.turn.getPlayer(this.getMentionedUsers()[0])
        const mentionedSecondPlayer = this.turn.getPlayer(this.getMentionedUsers()[1])
        if (!mentionedFirstPlayer || !mentionedSecondPlayer) {
          text += "Both users need to be playing this game."
        } else {
          text += this.tryToBetray(mentionedFirstPlayer, mentionedSecondPlayer)
        }
    }

    if (this.changes) this.turn.calculateDiplomacy()
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "Could not force a betrayal.")
  }

  tryToBetray(first, second) {
    if (first.id === second.id) {
      return `<@!${first.id}> is already their own worst enemy. You can't change that.`
    } 

    if (!first.isAlly(second)) {
      return `<@!${first.id}> and <@!${second.id}> already hate each other.`
    }

    this.changes = true
    first.betray(second)
    const text = `<@!${first.id}> and <@!${second.id}> are enemies once again.`
    if (second.isAlly(first)) {
      second.betray(first)
    }
    this.turn.saveBetrayHistory(first, second)
    return text
  }
}