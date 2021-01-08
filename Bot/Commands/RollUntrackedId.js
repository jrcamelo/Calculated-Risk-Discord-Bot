const RollIdCommand = require("./RollId");
const Utils = require("../Utils");
const Player = require("../Models/Player");

class RollUntrackedIdCommand extends RollIdCommand {
  static command = ["TestID", "TID", "UntrackedID", "UID"];
  static helpTitle = "Just like RollID, but the roll will not be saved.";
  static helpDescription = `${RollUntrackedIdCommand.prefix + this.command[0]}`;

  doRoll() {
    this.roll = this.player.roll(this.message, "TESTID", this.arg);
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
module.exports = RollUntrackedIdCommand;