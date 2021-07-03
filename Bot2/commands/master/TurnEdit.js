const BaseCommand = require("../base_command")

module.exports = class TurnEditCommand extends BaseCommand {
  static aliases = ["TurnEdit", "MupEdit", "EditMup"]
  static description = "Updates the current Mup image and description, without changing turn and rolls."
  static argsDescription = "[Description] {Map Attachment}"

  canDelete = false
  
  masterOnly = true
  needsGame = true
  shouldCleanArgsLineBreaks = false

  async execute() {
    this.game.editTurn(this.attachment, this.arg);
    if (saveOrReturnWarning()) return
    // TODO: MAKE GAME EMBED
    this.sendReply(`New turn is ${this.game._turn.number}`)
  }
}