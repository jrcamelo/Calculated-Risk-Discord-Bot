const BaseCommand = require("../base_command")
module.exports = class PlayerForceBreakCommand extends BaseCommand {
  static aliases = ["ForceBreak", "ForceNAPBreak"]
  static description = "Breaks a NAP between players."
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
    await this.sendReply(text || "Could not force break of NAP.")
  }

  tryToBetray(first, second) {
    if (first.id === second.id) {
      return `You have no powers over <@!${first.id}> mental health.`
    } 

    if (!first.isNAP(second)) {
      return `<@!${first.id}> and <@!${second.id}> already hate each other.`
    }

    this.changes = true
    first.break(second)
    const text = `<@!${first.id}> and <@!${second.id}> are enemies once again.`
    if (second.isNAP(first)) {
      second.break(first)
    }
    this.turn.saveBreakHistory(first, second)
    return text
  }
}