const RollCommand = require("./Roll")
const Roll = require("../../models/roll")

module.exports = class TestRollCommand extends RollCommand {
  static aliases = ["Reference", "RefTest", "Ref"]
  static description = "Shows how a roll would look like."
  static argsDescription = "<Roll>"
  needsGame = false
  playerOnly = false
  canDelete = true
  neededArgsAmount = 1

  isTest = true
  
  saveRollOrReturnWarning() {}

  async execute() {
    if (isNaN(+this.arg)) {
      return this.replyDeletable("That simply would not work.")
    }
    this.roll = new Roll(this.message)
    this.roll.doRollWithLimit()
    this.roll.value = +this.arg
    this.roll.calculateRoll()
    return this.sendReply(`For reference, if someone rolled that it would look like ${this.roll.formattedValue}`)
  }
}