const BaseCommand = require("../base_command")

module.exports = class BreakPactsCommand extends BaseCommand {
  static aliases = ["BreakAllPacts", "BreakAllNAPs", "BreakAll"]
  static description = "Breaks all Non Aggression Pacts in the game."
  static category = "Master"

  masterOnly = true
  needsGame = true

  async execute() {
    this.turn.breakAllPacts()
    if (this.saveOrReturnWarning()) return
    await this.sendReply("All Non Aggression Pacts have been broken.")
  }
}