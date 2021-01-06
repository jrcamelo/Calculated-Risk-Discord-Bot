const BaseCommand = require("./Base.js");
const Channel = require("../Models/Channel")

class JoinCommand extends BaseCommand {
  static command = "join";

  constructor(message, args) {
    super(message, args);
  }

  async execute() {
    
    const factionName = this.arg || this.message.author.username;

    this.channel = await new Channel().get(this.message.channel)
    if (this.channel.game == null) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }

    this.channel.createNewGame(this.message.author, this.arg)
    await this.channel.save()
    return await this.reply(`Game: ${this.channel.game.name}\nMaster: ${this.channel.game.master.username}`)
  }

}
module.exports = JoinCommand;