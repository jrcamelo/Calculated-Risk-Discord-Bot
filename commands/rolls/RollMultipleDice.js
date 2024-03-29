const BaseRollCommand = require("../roll_command")
const Roll = require("../../models/roll")

module.exports = class RollMultipleDiceCommand extends BaseRollCommand {
  static aliases = ["RollXD", "RXD", "XD"]
  static description = "Do multiple rolls with a limit. `RollDX` also works"
  static argsDescription = "<Multiple> <Limit> [Intention] {Attachment}"
  static category = "Player"

  neededArgsAmount = 2

  async execute() {
    this.getMultipleAndLimit()
    if (this.sendWarningOnInvalidMultiple()) return
    if (this.sendWarningOnInvalidLimit()) return

    this.addAttachmentToIntention()

    this.rolls = []
    for (let i = 0; i < this.multiple; i++) {
      const roll = new Roll(this.message, this.arg, this.gameTime, this.turnNumber, this.limit, this.isTest, this.isRanked, i+1)
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