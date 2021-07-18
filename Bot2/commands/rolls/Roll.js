const BaseRollCommand = require("../roll_command")
const Roll = require("../../models/roll")

module.exports = class RollCommand extends BaseRollCommand {
  static aliases = ["Roll", "R"]
  static description = "State your intention and put your life on RNG's hands. It will roll a number from 0 to 10¹¹."
  static argsDescription = "[Intention] {Attachment}"

  limit = null

  async execute() {
    this.addAttachmentToIntention()
    this.roll = new Roll(this.message, this.arg, this.limit)
    this.roll.doRollWithLimit()
    if (this.saveRollOrReturnWarning()) return
    // TODO: Use Presenter
    return this.sendReply(`${this.game.pingMaster()} --- ${this.player.pingWithFaction()} has rolled ${this.roll.formattedValue}`)
  }
}