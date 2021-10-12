const RollCommand = require("../roll_command")
const Roll = require("../../models/roll")
const { getMultipleLimitModifierFromDnD } = require("../../utils/rolls")

module.exports = class RollDnDCommand extends RollCommand {
  static aliases = ["RollDnD", "RDnD", "DnD"]
  static description = `Roll using DnD notation. If multiple rolls, the result is the sum.`
  static argsDescription = "<Multiple>D<Limit>"
  static category = "Player"

  neededArgsAmount = 0

  isRanked = false
  
  async execute() {
    this.getMultipleAndLimit()
    if (this.sendWarningOnInvalidMultiple(100)) return
    if (this.sendWarningOnInvalidLimit()) return

    this.addAttachmentToIntention()

    this.roll = new Roll(this.message, this.arg, this.gameTime, this.turnNumber, this.limit, this.isTest, this.isRanked)
    this.roll.value = 0
    let rolls = ""
    for (let i = 0; i < this.multiple; i++) {
      const roll = new Roll(this.message, this.arg, this.gameTime, this.turnNumber, this.limit, this.isTest, this.isRanked)
      roll.doRollWithLimit()
      
      if (i == this.multiple - 1) rolls += roll.value
      else rolls += roll.value + " + "
      this.roll.value += roll.value
    }

    let modifierString = ""
    if (this.modifier && !isNaN(this.modifier)) {
      modifierString = ` + ${this.modifier} => **${+this.roll.value + +this.modifier}**`
    }
    if (this.multiple == 1) this.roll.formattedValue = `**${this.roll.value}**${modifierString}`
    else this.roll.formattedValue = `${rolls} = **${this.roll.value}**${modifierString}`
    this.roll.value += +this.modifier

    if (this.saveRollOrReturnWarning()) return
    await this.sendRollResult()
    this.roll.formattedValue = `**${this.roll.value}**`
    if (this.saveRollOrReturnWarning()) return
  }
  
  getMultipleAndLimit() {
    const arg = this.takeFirstArg()
    if (!arg) {
      this.limit = 20
      this.multiple = 1
      this.modifier = 0
      return
    }
    const dnd = getMultipleLimitModifierFromDnD(arg)
    if (!dnd) return
    this.limit = dnd.limit
    this.multiple = dnd.multiple
    this.modifier = dnd.modifier
  }
}