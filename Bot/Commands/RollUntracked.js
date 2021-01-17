const RollCommand = require("./Roll");
const Utils = require("../Utils");
const Player = require("../Models/Player");
const Turn = require("../Models/Turn");

class RollUntrackedCommand extends RollCommand {
  static command = ["Test", "T", "TR", "TD"];
  static helpTitle = "Just like roll, but will not be saved.";
  static helpDescription() { return `${RollUntrackedCommand.prefix + this.command[0]}{Limit Number}`; }

  async execute() {
    this.fakeTurn = new Turn().create();
    let fakePlayer = new Player().create(this.message.author);
    this.fakeTurn.players[fakePlayer.user.id] = fakePlayer;
    await super.execute();
    await this.addDeleteReactionToReply();
    await this.waitReplyReaction();
  }

  doRoll() {
    this.getRollLimitInput();
    this.roll = this.fakeTurn.doPlayerRoll(this.message, "TEST", "", this.rollLimit);
  }

  save() {
    // Don't save
  }

  pingGM() {
    return "";
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