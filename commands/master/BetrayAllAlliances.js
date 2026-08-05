const BaseCommand = require("../base_command")

module.exports = class BreakAlliancesCommand extends BaseCommand {
  static aliases = ["BetrayAllAlliances", "BetrayAllAllies", "BetrayAll"]
  static description = "Breaks all alliances in the game. (Aliases: BetrayAllAllies)"
  static category = "Master"

  masterOnly = true
  needsGame = true

  async execute() {
    this.turn.breakAllAlliances()
    if (this.saveOrReturnWarning()) return
    await this.sendReply("All alliances have been broken.")
  }
}
