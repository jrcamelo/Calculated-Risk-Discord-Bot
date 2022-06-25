const BaseCommand = require("../base_command")

module.exports = class PlayerHardquitCommand extends BaseCommand {
  static aliases = ["Hardquit"]
  static description = "Leave and can't be added by the master."
  static argsDescription = ""
  static category = "Player"

  canDelete = false
  acceptAdmins = false
  acceptModerators = false

  needsGame = true
  playerOnly = true
  aliveOnly = true
  
  canMention = true

  async execute() {
    this.turn.banPlayer(this.player)
    this.game.addToQuitList(this.player.id)
    if (this.saveOrReturnWarning()) return
    this.sendReply(`${this.player.ping()} has left the game.`)
  }
}