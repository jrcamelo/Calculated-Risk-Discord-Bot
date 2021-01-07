const BaseCommand = require("./Base.js");

class PlayCommand extends BaseCommand {
  static command = "claim";

  constructor(message, args) {
    super(message, args);
  }

  async execute() {    
    if (this.game == null) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }

    const factionName = this.arg || "";
    this.game.addPlayer(this.message.author)
    await this.channel.save()
    return await this.reply(this.game.makeCurrentGameEmbed())
  }

}
module.exports = PlayCommand;