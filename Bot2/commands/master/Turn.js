const BaseCommand = require("../base_command")

module.exports = class TurnCommand extends BaseCommand {
  static aliases = ["Turn", "Mup"]
  static description = "Starts next turn with an image and description."
  static argsDescription = "[Description] {Map Attachment}"

  canDelete = false
  masterOnly = true
  needsGame = true

  async execute() {
    this.game.nextTurn(this.attachment, this.arg);
    if (saveOrReturnWarning()) return
    // TODO: MAKE GAME EMBED
    this.sendReply(`New turn is ${this.game._turn.number}`)
  }
}