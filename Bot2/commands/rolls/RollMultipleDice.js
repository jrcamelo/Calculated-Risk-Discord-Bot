const BaseRollCommand = require("../roll_command")
const Roll = require("../../models/roll")

module.exports = class RollMultipleDiceCommand extends BaseRollCommand {
  static aliases = ["RollXD", "RXD", "XD"]
  static description = `Do multiple rolls with a limit. No more than ${BaseRollCommand.MULTIPLE_ROLL_LIMIT}.`
  static argsDescription = "<Multiple> <Limit> [Intention] {Attachment}"

  neededArgsAmount = 2

  async execute() {
    this.getMultipleAndLimit()
    if (this.sendWarningOnInvalidMultiple()) return
    if (this.sendWarningOnInvalidLimit()) return

    this.addAttachmentToIntention()
    this.rolls = []
    for (let i = 0; i < this.multiple; i++) {
      const roll = new Roll(this.message, this.arg, this.gameTime, this.turnNumber, this.limit, this.isTest, this.isRanked)
      roll.doRollWithLimit()
      this.rolls.push(roll)
    }

    if (this.saveMultipleRollsOrReturnWarning()) return
    this.sendRollResult()
  }

  async sendRollResult() {
    return await this.sendMultipleRollResult()
  }

  getMultipleAndLimit() {
    this.multiple = +this.takeFirstArg()
    this.limit = +this.takeFirstArg()
  }
}