const RollMultipleDiceCommand = require("./RollMultipleDice")


module.exports = class RollDiceMultipleCommand extends RollMultipleDiceCommand {
  static aliases = ["RollDX", "RDX", "DX"]
  static argsDescription = "<Limit> <Multiple> [Intention] {Attachment}"
  static category = "Player"

  neededArgsAmount = 2

  getMultipleAndLimit() {
    this.limit = +this.takeFirstArg()
    this.multiple = +this.takeFirstArg()
  }

  async sendRollResult() {
    return await this.sendMultipleRollResult()
  }
}