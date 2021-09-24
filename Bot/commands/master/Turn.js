const BaseCommand = require("../base_command")
const StatusCommand = require("../info/StatusShorter")
const PingCommand = require("./PlayerPing")

module.exports = class TurnCommand extends BaseCommand {
  static aliases = ["Turn", "Mup"]
  static description = "Starts next turn with an image and description."
  static argsDescription = "[Description] {Image}"
  static category = "Master"

  canDelete = false
  masterOnly = true
  needsGame = true

  async execute() {
    this.game.nextTurn(this.attachment, this.arg);
    if (this.saveOrReturnWarning()) return
    const status = new StatusCommand(this.message, this.args)
    await status.prepare()
    await status.tryExecute()
    const ping = new PingCommand(this.message, this.args)
    await ping.prepare()
    await ping.tryExecute()
  }
}