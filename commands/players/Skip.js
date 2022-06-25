const BaseCommand = require("../base_command")
module.exports = class PlayerSkipCommand extends BaseCommand {
  static aliases = ["Skip"]
  static description = "Count as rolled this turn"
  static argsDescription = ""
  static category = "Player"

  canDelete = false
  needsGame = true
  playerOnly = true
  aliveOnly = true
  canMention = true

  async execute() {
    if (this.player.rolled) {
      return this.sendReply("You have already rolled this turn.")
    }

    this.player.rolled = true;
    if (this.saveOrReturnWarning()) return

    let text = `<@!${this.game.masterId}> —— ${this.player.ping()} has skipped their roll.`
    if (this.turn && this.turn.everyoneHasRolled()) {
      text += "\n\n**All players have rolled this turn!**"
    }
    await this.sendReply(text)
  }
}