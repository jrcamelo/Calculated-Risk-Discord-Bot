const BaseCommand = require("./Base.js");

class GameWhatCommand extends BaseCommand {
  static command = "game";

  constructor(message, args) {
    super(message, args);
  }

  async execute() {
    if (this.game == null) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    console.log(this.channel.game.master)
    return await this.reply(this.channel.game.makeCurrentGameEmbed())
  }

}
module.exports = GameWhatCommand;