const BaseCommand = require("./Base.js");

class RollBaseCommand extends BaseCommand {
  static command = ["Roll"];
  static helpTitle = "State your intention and put your life on Fate's hands.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} [Intention]`;

  async execute() {
    const error = this.validate();
    if (error != null) {
      return await error;
    }
    this.doRoll();
    if (this.roll == null) {
      return;
    }
    this.save();
    return this.reply(this.roll.makeText(this.player));
  }


  doRoll() {
    this.roll = this.player.roll(this.message, "NORMAL", this.arg);
  }

  thereIsNoGame() {
    return this.channel.game == null;
  }

  userIsNotPlaying() {
    return this.player == null;
  }

  validate() {
    if (this.thereIsNoGame()) {
        return this.reply(`There is currently no game being hosted in this channel.`)
    }
    this.loadPlayer();
    if (this.userIsNotPlaying()) {
        return this.reply(`You have not joined this game yet.`)
    }

    return this.validateArgs();
  }

  loadPlayer() {
    if (this.channel.game != null) {
      this.player = this.channel.game.getPlayer(this.message.author);
    }
  }

  validateArgs() {
    return;
  }
}
module.exports = RollBaseCommand;