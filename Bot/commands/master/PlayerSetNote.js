const BaseCommand = require("../base_command")

module.exports = class PlayerSetNoteCommand extends BaseCommand {
  static aliases = ["SetNote", "Note"]
  static description = "Sets a note for a player, which can be seen by using `Notes`. \nAccepts many players with |"
  static argsDescription = "<@User> <Note> | <@User> <Note>"
  static category = "Master"

  canDelete = false
  masterOnly = true

  needsGame = true
  
  async execute() {
    let resultMessage = ""
    for (const command of this.getMultipleMentionsAndArgs()) {
      const { id, mention, arg } = command
      const player = this.turn.getPlayer({ id })
      if (!mention || !player) {
        resultMessage += `**${mention}** is not a valid player.\n`
      } else {
        player.setNote(arg)
        resultMessage += `**${mention}** notes now say **${player.note}**.\n`
      }
    }
    if (this.saveOrReturnWarning()) return
    await this.replyDeletable(resultMessage || "No valid players found.")
  }
}