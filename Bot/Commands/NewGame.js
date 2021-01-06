const BaseCommand = require("./Base.js");
const Channel = require("../Models/Channel")

class NewGameCommand extends BaseCommand {
  static command = "newgame";

  constructor(message, args) {
    super(message, args);
  }

  async execute() {
    if (this.isArgsBlank()) {
      return await this.message.reply("Try again with a name for the game.")
    }
    this.channel = await new Channel().get(this.message.channel)
    if (this.channel.game != null) {
        return await this.reply(`There is already an ongoing game in this channel:\nGame: ${this.channel.game.name}\nMaster: ${this.channel.game.master}`)
    }
    this.channel.createNewGame(this.message.author, this.arg)
    await this.channel.save()
    return await this.reply(`Game: ${this.channel.game.name}\nMaster: ${this.channel.game.master.username}`)
  }

}
module.exports = NewGameCommand;