const RollCommand = require("./Roll");
const Utils = require("../Utils");
const Player = require("../Models/Player");

class RollUntrackedCommand extends RollCommand {
  static command = ["Test", "T", "Untracked", "URoll", "UR", "U"];
  static helpTitle = "Just like roll, but will not be saved as a roll. Default limit is 1000000000000.";
  static helpDescription = `${RollUntrackedCommand.prefix + this.command[0]}{Limit Number}`;

  doRoll() {
    this.getRollLimitInput();
    this.roll = this.player.roll(this.message, "TEST", this.arg, this.rollLimit);
  }

  save() {
    // Don't save
  }

  thereIsNoGame() {
    return false;
  }

  userIsNotPlaying() {
    return false;
  }

  loadPlayer() {
    this.player = new Player().create(this.message.author);
  }
}
module.exports = RollUntrackedCommand;