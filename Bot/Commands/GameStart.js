const BaseCommand = require("./Base.js");

class GameStartCommand extends BaseCommand {
  static command = ["StartGame", "NewGame"];
  static helpTitle = "Starts a new game in this channel. You will be the GM.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]} <Title of the Game>` }

  async execute() {
    if (this.isArgsBlank()) {
      return await this.sendReplyWithDelete("Try again with a name for the game.")
    }
    if (this.channel.game != null) {
        return await this.sendReplyWithDelete(`There is a game being hosted in this channel already.`)
    }
    this.channel.createNewGame(this.message.author, this.arg)
    await this.save();
    await this.sendReplyWithDelete(this.channel.game.makeCurrentGameEmbed())
  }

}
module.exports = GameStartCommand;