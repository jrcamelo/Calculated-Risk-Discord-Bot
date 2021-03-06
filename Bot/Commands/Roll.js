const RollBaseCommand = require("./RollBase");
const Utils = require("../Utils");

class RollCommand extends RollBaseCommand {
  static command = ["Roll", "R", "D"];
  static helpTitle = "Choose a limit for the roll (r100, d20), state your intention and put your life on Fate's hands.";
  static helpDescription() { return `${RollBaseCommand.prefix + this.command[0]}{Limit Number} [Intention]`; }

  static isRequestedCommand(input) {
    for (let commandText of this.command) {
      if (input.toLowerCase() == commandText.toLowerCase()) {
        return true;
      }
      if (input.toLowerCase().startsWith(commandText.toLowerCase())) {
        if (this.hasNumberSuffix(input, commandText)) {
          return true;
        }
      }
    }
    return false;
  }

  static hasNumberSuffix(input, command) {
    let suffix = input.slice(command.length);    
    if (isNaN(suffix) === false && +suffix > 0) {
      if (suffix == Utils.keepOnlyNumbers(suffix)) {
        return true;
      }
    }
  }

  doRoll() {
    this.getRollLimitInput();
    this.roll = this.getTurn().doPlayerRoll(this.message, "NORMAL", this.arg, this.rollLimit);
  }

  getRollLimitInput() {
    this.rollLimit = Utils.keepOnlyNumbers(this.userCommand);
  }

  validateArgs() {
    return;
  }
}
module.exports = RollCommand;