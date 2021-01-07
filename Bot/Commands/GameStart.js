const BaseCommand = require("./Base.js");

class GameStartCommand extends BaseCommand {
  static command = "StartGame";
  static helpTitle = "Starts a new game in this channel. User that runs this command will be the GM of said game.";
  static helpDescription = `${BaseCommand.prefix + this.command} <Title of the Game>`

  constructor(message, args) {
    super(message, args);
  }

  async execute() {
    if (this.isArgsBlank()) {
      return await this.message.reply("Try again with a name for the game.")
    }
    if (this.game != null) {
        return await this.reply(`There is a game being hosted in this channel already.`)
    }
    this.channel.createNewGame(this.message.author, this.arg)
    await this.channel.save()
    return await this.reply(this.channel.game.makeCurrentGameEmbed())
  }

}
module.exports = GameStartCommand;