const BaseCommand = require("./base")

module.exports = class PingCommand extends BaseCommand {
  static name = "ping"
  static aliases = ["wtf"]
  static description = "Replies with Pong!"
  // Restrictions
  needGame = false
  masterOnly = false
  acceptModerators = true
  playerOnly = false
  aliveOnly = false
  // Database
  getsGame = true
  getsTurn = true
  // Deletion
  canDelete = true
  limitDelete = false

  async execute() {
    this.sendReply("Pong!")
  }
}