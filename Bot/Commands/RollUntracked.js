const RollCommand = require("./Roll");
const Utils = require("../Utils");
const Player = require("../Models/Player");

class RollUntrackedCommand extends RollCommand {
  static command = ["Test", "T", "Untracked", "U"];
  static helpTitle = "Just like roll, but will not be saved as a roll.";
  static helpDescription = `${RollUntrackedCommand.prefix + this.command[0]}{Limit Number}`;

  async execute() {
    await super.execute();
    await this.addDeleteReactionToReply();
    await this.waitReplyReaction();
  }

  doRoll() {
    this.getRollLimitInput();
    this.roll = this.getTurn().doPlayerRoll(this.message, "TEST", "", this.rollLimit);
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

  playerIsDead() {
    return false;
  }

  loadPlayer() {
    this.player = new Player().create(this.message.author);
  }
}
module.exports = RollUntrackedCommand;