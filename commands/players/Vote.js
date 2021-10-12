const BaseCommand = require("../base_command")

module.exports = class PlayerVoteCommand extends BaseCommand {
  static aliases = ["Vote"]
  static description = "Sets a vote for this turn's poll."
  static argsDescription = "<Vote>"
  static category = "Player"

  canDelete = false
  needsGame = true
  needsPlayer = true
  canMention = false
  neededArgsAmount = 1

  async execute() {
    this.turn.setPlayerVote(this.player, this.arg)
    if (this.saveOrReturnWarning()) return
    await this.message.react("✅")
  }
}