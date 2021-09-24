const BaseCommand = require("../base_command")
const StatusCommand = require("../info/StatusShorter")

module.exports = class TurnEditCommand extends BaseCommand {
  static aliases = ["TurnEdit", "MupEdit", "EditMup"]
  static description = "Changes the current Mup image and description. Try `EditOld` as well."
  static argsDescription = "[Description] {Image}"
  static category = "Master"

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