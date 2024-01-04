const BaseCommand = require("../base_command.js");

module.exports = class WhoRightCommand extends BaseCommand  {
  static aliases = ["RollInitiative", "Initiative", "Ini"]
  static description = "Everyone roll initiative"
  static argsDescription = ""

  canDelete = false
  masterOnly = true

  async execute() {
    return this.sendReply(this.turn.listAlliancesInSemiRandomOrder())
  }
}