const RollBaseCommand = require("./RollBase")

class RollIdCommand extends RollBaseCommand {
  static command = ["RollID", "RID", "ID"];
  static helpTitle = "State your intention and put your life on Discord's hands.";
  static helpDescription = `${RollBaseCommand.prefix + this.command[0]} <Message>`;

  doRoll() {
    this.roll = this.player.roll(this.turn, this.message, "ID", this.arg);
  }

  validateArgs() {
    return;
  }
}
module.exports = RollIdCommand;