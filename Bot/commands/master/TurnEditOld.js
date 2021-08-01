const BaseCommand = require("../base_command")
const StatusCommand = require("../info/Status")

module.exports = class TurnEditOldCommand extends BaseCommand {
  static aliases = ["EditOld", "OldEdit"]
  static description = "Updates the description or mup of an old turn."
  static argsDescription = "<Turn number> [Description] {Map Attachment}"

  canDelete = false

  masterOnly = true
  needsGame = true
  shouldCleanArgsLineBreaks = false
  neededArgsAmount = 1

  async execute() {
    const turnNumber = this.takeFirstArg()
    if (isNaN(turnNumber) || turnNumber < 0 || turnNumber > this.game.turnNumber) {
      return this.replyDeletable("Invalid turn number.")
    }
    this.game.editOldTurnAndSave(this.attachment, this.arg, +turnNumber);
    // if (this.saveOrReturnWarning()) return
    return this.replyDeletable(`Turn ${turnNumber} has been updated.`)
  }
}