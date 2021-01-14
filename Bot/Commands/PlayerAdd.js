const BaseCommand = require("./Base.js");

class PlayerAddCommand extends BaseCommand {
  static command = ["Add"];
  static helpTitle = "Adds a player to the game.";
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

    this.newPlayer = this.channel.getPlayer(this.mentionedUser);
    if (this.newPlayer) {
      return await this.reply(`This user is already playing this game.`);
    }

    this.arg.shift();
    this.joinArgsIntoArg();
    this.newPlayer = this.getTurn().addPlayer(this.mentionedUser, this.arg);
    this.save();
    await this.reply(`${this.newPlayer.user.username} has been added to the game.`);
  }

}
module.exports = PlayerAddCommand;