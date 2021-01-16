const BaseCommand = require("./Base.js");

class PlayerAddCommand extends BaseCommand {
  static command = ["Add", "Change"];
  static helpTitle = "Adds a player to the game. Can also rename the player.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <@Player>`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster() && this.userIsNotMod()) {
        return await this.reply(`You are not the GM of this game.`)
    }

    this.mentionedUser = this.getMentionedUser();
    if (!this.mentionedUser) {
      return await this.reply(`Try again while mentioning a Player.`)
    }

    this.args.shift();
    this.joinArgsIntoArg();
    this.newPlayer = await this.getTurn().addPlayer(this.mentionedUser, this.arg);
    await this.save();
    await this.reply(`${this.newPlayer.describeName()} has been added to the game.`);
  }

}
module.exports = PlayerAddCommand;