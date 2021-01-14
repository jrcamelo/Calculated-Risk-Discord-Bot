const RollUntrackedCommand = require("./RollUntracked");
const Utils = require("../Utils");
const Player = require("../Models/Player");

class RollUntrackedIdCommand extends RollUntrackedCommand {
  static command = ["TestID", "TID"];
  static helpTitle = "Just like RollID, but the roll will not be saved.";
  static helpDescription = `${RollUntrackedIdCommand.prefix + this.command[0]}`;

  doRoll() {
    this.roll = this.getTurn().doPlayerRoll(this.message, "TESTID", "");
  }

  validateArgs() {
    return;
  }
}
module.exports = RollUntrackedIdCommand;