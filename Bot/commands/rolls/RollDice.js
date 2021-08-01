const BaseRollCommand = require("../roll_command")
const Roll = require("../../models/roll")

module.exports = class RollDiceCommand extends BaseRollCommand {
  static aliases = ["RollD", "RD", "D"]
  static description = "Roll with a specified limit. 10¹¹ is the maximum value."
  static argsDescription = "<Limit> [Intention] {Attachment}"

  neededArgsAmount = 1

  async execute() {
    this.limit = +this.takeFirstArg()
    if (this.sendWarningOnInvalidLimit()) return

    this.addAttachmentToIntention()
    this.roll = new Roll(this.message, this.arg, this.gameTime, this.turnNumber, this.limit, this.isTest, this.isRanked)
    this.roll.doRollWithLimit()
    if (this.saveRollOrReturnWarning()) return
    this.sendRollResult()
  }
}