const BaseCommand = require("../base_command")

module.exports = class PlayerRagequitCommand extends BaseCommand {
  static aliases = ["Ragequit", "Leave", "Quit", "Resign"]
  static description = "Suicide then leave on the next turn. Try `r.hardquit` to leave for real."
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
    this.turn.kickPlayer(this.player)
    this.game.addToQuitList(this.player.id)
    if (this.saveOrReturnWarning()) return
    this.sendReply(`${this.player.ping()} has given up and will be removed next turn. Try \`r.hardquit\` if you don't want to be readded.`)
  }
}