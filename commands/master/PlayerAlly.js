const BaseCommand = require("../base_command")
module.exports = class PlayerForceAllyCommand extends BaseCommand {
  static aliases = ["ForceAlly", "ForceAlliance"]
  static description = "Create an alliance between players. `r.ForceNAP` for NAPs"
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
          text += this.tryToAlly(mentionedFirstPlayer, mentionedSecondPlayer)
        }
    }

    if (this.changes) this.turn.calculateDiplomacy()
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "Could not force alliance.")
  }

  tryToAlly(first, second) {
    if (first.id === second.id) {
      return `You somehow can't fix <@!${first.id}>'s self esteem.`
    } 

    if (first.isAlly(second) && second.isAlly(first)) {
      return `<@!${first.id}> and <@!${second.id}> are already allied.`
    }

    this.changes = true
    first.allyWith(second)
    const text = `<@!${first.id}> and <@!${second.id}> are now allied.`
    if (!second.isAlly(first)) {
      second.allyWith(first)
    }
    this.turn.saveAllyHistory(first, second)
    return text
  }
}