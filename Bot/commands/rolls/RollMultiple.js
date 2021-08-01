const BaseRollCommand = require("../roll_command")
const Roll = require("../../models/roll")

module.exports = class RollMultipleCommand extends BaseRollCommand {
  static aliases = ["RollX", "RX", "X"]
  static description = `Do multiple rolls. No more than ${BaseRollCommand.MULTIPLE_ROLL_LIMIT}.`
  static argsDescription = "<Multiple> [Intention] {Attachment}"

  neededArgsAmount = 1

  async execute() {
    this.multiple = +this.takeFirstArg()
    if (this.sendWarningOnInvalidMultiple()) return

    this.addAttachmentToIntention()
    this.rolls = []
    for (let i = 0; i < this.multiple; i++) {
      const roll = new Roll(this.message, this.arg, this.gameTime, this.turnNumber, null, this.isTest, this.isRanked)
      roll.doRollWithLimit()
      this.rolls.push(roll)
    }

    if (this.saveMultipleRollsOrReturnWarning()) return
    this.sendRollResult()
  }

  async sendRollResult() {
    return await this.sendMultipleRollResult()
  }
}