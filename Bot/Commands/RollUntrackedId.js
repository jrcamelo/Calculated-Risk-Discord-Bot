const RollUntrackedCommand = require("./RollUntracked");
const Utils = require("../Utils");
const Player = require("../Models/Player");

class RollUntrackedIdCommand extends RollUntrackedCommand {
  static command = ["TestID", "TID"];
  static helpTitle = "Just like RollID, but will not be saved.";
  static helpDescription() { return `${RollUntrackedIdCommand.prefix + this.command[0]}`; }

  doRoll() {
    this.roll = this.fakeTurn.doPlayerRoll(this.message, "TESTID", "");
  }

  validateArgs() {
    return;
  }
}
module.exports = RollUntrackedIdCommand;