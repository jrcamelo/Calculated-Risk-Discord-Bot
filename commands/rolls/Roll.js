const BaseRollCommand = require("../roll_command")
const Roll = require("../../models/roll")

module.exports = class RollCommand extends BaseRollCommand {
  static aliases = ["Roll", "R"]
  static description = "State your intention and pray to RNG. Rolls a number from 1 to 10¹¹. `r.skip` to pass."
  static argsDescription = "[Intention] {Attachment}"
  static category = "Player"

  limit = null

  async execute() {
    this.addAttachmentToIntention()
    this.roll = new Roll(this.message, this.arg, this.gameTime, this.turnNumber, this.limit, this.isTest, this.isRanked)
    this.roll.doRollWithLimit()
    if (this.saveRollOrReturnWarning()) return
    this.sendSingleRollResult()
  }
}