const BaseCommand = require("./Base.js");

class NewGameCommand extends BaseCommand {
  static command = "newgame";

  constructor(message, args) {
    super(message, args);
  }

  async execute() {
    if (this.isArgsBlank()) {
      return await this.message.reply("Try again with a name for the game.")
    }
    if (this.game != null) {
        return await this.reply(`There is already an ongoing game in this channel:\nGame: ${this.game.name}\nMaster: ${this.game.master}`)
    }
    this.channel.createNewGame(this.message.author, this.arg)
    await this.channel.save()
    return await this.reply(`Game: ${this.game.name}\nMaster: ${this.game.master.username}`)
  }

}
module.exports = NewGameCommand;