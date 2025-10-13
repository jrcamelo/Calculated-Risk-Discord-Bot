const BaseCommand = require("../base_command")

module.exports = class GameCloseCommand extends BaseCommand {
  static aliases = ["Close", "CloseClaims", "CloseJoins"]
  static description = "Makes it impossible for new players to join without the Master adding them. Use it again to reopen."
  static argsDescription = ""
  static category = "Master"

  canDelete = false
  masterOnly = true

  needsGame = true

  async execute() {
    this.game.toggleClosedClaims()
    if (this.saveOrReturnWarning()) return
    if (this.game.closed) {
      this.sendReply(`Game is closed. From now on, the only way to join this game is if the Master adds you.`)
    } else {
      this.sendReply(`Game is reopened. Anyone can join as usual.`)
    }
  }
}