const BaseRollCommand = require("../roll_command")
const Roll = require("../../models/roll")

module.exports = class RollIdCommand extends BaseRollCommand {
  static aliases = ["RollID", "RID", "ID"]
  static description = "State your intention and put your life on Discord's hands."
  static argsDescription = "[Intention] {Attachment}"

  async execute() {
    this.addAttachmentToIntention()
    this.roll = new Roll(this.message, this.arg)
    this.roll.doRollWithID()
    if (this.saveRollOrReturnWarning()) return
    // TODO: Use Presenter
    return this.sendReply(`${this.game.pingMaster()} --- ${this.player.pingWithFaction()} has rolled ID ${this.roll.formattedValue}`)
  }
}