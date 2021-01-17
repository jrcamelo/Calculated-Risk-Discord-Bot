const RollBaseCommand = require("./RollBase")

class RollIdCommand extends RollBaseCommand {
  static command = ["RollID", "RID", "ID"];
  static helpTitle = "State your intention and put your life on Discord's hands.";
  static helpDescription() { return `${RollBaseCommand.prefix + this.command[0]} [Intention]`; }

  doRoll() {
    this.roll = this.getTurn().doPlayerRoll(this.message, "ID", this.arg);
  }

  validateArgs() {
    return;
  }
}
module.exports = RollIdCommand;