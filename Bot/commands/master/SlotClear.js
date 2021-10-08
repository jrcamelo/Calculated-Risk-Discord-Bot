const BaseCommand = require("../base_command")

module.exports = class SlotAddCommand extends BaseCommand {
  static aliases = ["SlotClear", "SClear"]
  static description = "Removes all faction slots."
  static argsDescription = ""
  static category = "Master"

  canDelete = false
  masterOnly = true
  needsGame = true
  
  async execute() {
    this.turn.clearFactions()
    if (this.saveOrReturnWarning()) return
    return this.sendReply("All faction slots have been removed.")
  }
}