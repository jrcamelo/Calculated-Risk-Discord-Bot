const BaseCommand = require("../base_command")
module.exports = class PlayerForceNapCommand extends BaseCommand {
  static aliases = ["ForceNAP", "ForcePact"]
  static description = "Create a non-aggression pact between players."
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
          text += this.tryToNAP(mentionedFirstPlayer, mentionedSecondPlayer)
        }
    }

    if (this.changes) this.turn.calculatePacts()
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "Could not force a NAP.")
  }

  tryToNAP(first, second) {
    if (first.id === second.id) {
      return `You somehow can't stop <@!${first.id}>'s coping mechanisms.`
    } 

    if (first.isNAP(second) && second.isNAP(first)) {
      return `<@!${first.id}> and <@!${second.id}> are already in a NAP.`
    }

    this.changes = true
    first.napWith(second)
    const text = `<@!${first.id}> and <@!${second.id}> are now in a NAP.`
    if (!second.isNAP(first)) {
      second.napWith(first)
    }
    this.turn.saveNapHistory(first, second)
    return text
  }
}