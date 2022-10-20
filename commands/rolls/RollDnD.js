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
    const firstArg = this.takeFirstArg()
    this.addAttachmentToIntention()

    this.roll = new Roll(this.message, this.arg, this.gameTime, this.turnNumber, 1, this.isTest, this.isRanked)
    this.roll.doRollWithLimit()
    this.roll.value = 0

    const results = []
    const modifiers = []
    for (let rollPrompt of this.splitPrompts(firstArg)) {
      const dnd = getMultipleLimitModifierFromDnD(rollPrompt)
      if (!dnd) return this.sendReply(`Invalid DnD roll: ${rollPrompt}`)
      this.multiple = dnd.multiple
      this.limit = dnd.limit
      if (this.sendWarningOnInvalidMultiple(50)) return
      if (this.sendWarningOnInvalidLimit()) return

      const result = this.executeRollPrompt(dnd)
      results.push(result)
      modifiers.push(dnd.modifier)
    }

    let resultString = results.map((rolls, i) => {
      const sumString = rolls.reduce((sumString, roll) => {
        if (sumString) return `${sumString}+${roll}`
        return `${roll}`
      }, "")
      const sum = rolls.reduce((a, b) => a + b, 0)
      if (modifiers[i]) return `${sumString} = **${sum}**+**${modifiers[i]}**`
      return `${sumString} = **${sum}**`
    })
    // Join result string with ( )
    if (resultString.length > 1) {
      resultString = resultString.reduce((a, b) => `(${a}) + (${b})`)
    }    

    let finalValue = 0
    for (let i = 0; i < results.length; i++) {
      finalValue += results[i].reduce((a, b) => a + b, 0) + (modifiers[i] || 0)
    }
    console.log(finalValue)
    resultString += ` => **${finalValue}**`
    this.roll.value = finalValue
    this.roll.formattedValue = resultString

    if (this.saveRollOrReturnWarning()) return
    await this.sendRollResult()
    this.roll.formattedValue = `**${this.roll.value}**`
    if (this.saveRollOrReturnWarning()) return
  }

  splitPrompts(arg) {
    // "(2d20)+(1d10+5)+(1d100)" => ["2d20", "1d10+5", "1d100"]
    if (!arg) return
    const regex = /\(([^)]+)\)/g
    const matches = arg.match(regex)
    if (!matches) return [ arg ]
    return matches.map(match => match.replace(/[()]/g, ""))
  }

  executeRollPrompt(dnd) {
    let result = []
    for (let i = 0; i < dnd.multiple; i++) {
      const roll = new Roll(this.message, this.arg, this.gameTime, this.turnNumber, dnd.limit, this.isTest, this.isRanked)
      roll.doRollWithLimit()
      result.push(roll.value)
    }
    return result
  }
}