const BaseCommand = require("../base_command")

module.exports = class SlotKeepCommand extends BaseCommand {
  static aliases = ["SlotKeep", "SKeep", "KeepSlots", "KeepSlot", "SlotsKeep"]
  static description = "Toggles keeping the slots after mupping. Default is false."
  static argsDescription = ""
  static category = "Master"

  canDelete = false
  masterOnly = true
  needsGame = true
  ephemeral = true

  async execute() {
    this.game.keepSlotsOnMup = !this.game.keepSlotsOnMup
    if (this.saveOrReturnWarning()) return
    if (this.game.keepSlotsOnMup == true) {
      return this.replyEphemeral("Slots will be kept after mups now.")
    } else {
      return this.replyEphemeral("Slots will go back to resetting after mups.")
    }
  }
}
