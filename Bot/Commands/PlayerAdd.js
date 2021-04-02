const BaseCommand = require("./Base.js");

class PlayerAddCommand extends BaseCommand {
  static command = ["Add", "Change"];
  static helpTitle = "Adds a player to the game. Can also rename the player.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]} <@Player>`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster()) {
        return await this.sendReplyWithDelete(`You are not the GM of this game.`)
    }

    this.mentionedUser = this.getMentionedUser();
    if (!this.mentionedUser) {
      return await this.sendReplyWithDelete(`Try again while mentioning a Player.`)
    }

    this.args.shift();
    this.joinArgsIntoArg();
    this.arg = this.cleanLineBreaks(this.arg);
    this.newPlayer = await this.getTurn().addPlayer(this.mentionedUser, this.arg);
    await this.save();
    await this.sendReply(`${this.newPlayer.describeName()} has been added to the game.`);
  }

}
module.exports = PlayerAddCommand;