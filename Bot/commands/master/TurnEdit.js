const BaseCommand = require("../base_command")
const StatusCommand = require("../info/Status")

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
    if (this.saveOrReturnWarning()) return
    const status = new StatusCommand(this.message, this.args)
    await status.prepare()
    await status.tryExecute()
  }
}