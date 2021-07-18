const RollMultipleDiceCommand = require("./RollMultipleDice")
const { getMultipleLimitModifierFromDnD } = require("../../utils/rolls")

module.exports = class RollDnDCommand extends RollMultipleDiceCommand {
  static aliases = ["RollDnD", "RDnD", "DnD"]
  static description = `Roll using DnD notation. If multiple rolls, the result is the sum.`
  static argsDescription = "<Multiple>D<Limit>"

  neededArgsAmount = 0

  isRanked = false
  
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

  // TODO: Sum the rolls
  // TODO: Use presenter
}