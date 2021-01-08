const BaseCommand = require("./Base.js");

class GameStartCommand extends BaseCommand {
  static command = ["StartGame", "NewGame"];
  static helpTitle = "Starts a new game in this channel. User that runs this command will be the GM of said game.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <Title of the Game>`

  async execute() {
    if (this.isArgsBlank()) {
      return await this.message.reply("Try again with a name for the game.")
    }
    if (this.channel.game != null) {
        return await this.reply(`There is a game being hosted in this channel already.`)
    }
    this.channel.createNewGame(this.message.author, this.arg)
    await this.save();
    return await this.reply(this.channel.game.makeCurrentGameEmbed())
  }

}
module.exports = GameStartCommand;