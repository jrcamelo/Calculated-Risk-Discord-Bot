const BaseCommand = require("./Base.js");

class GameWhatCommand extends BaseCommand {
  static command = ["Game", "Current", "G"];
  static helpTitle = "Checks the game being hosted in the current channel.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]}`;

  async execute() {
    if (this.channel.game == null) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    return await this.reply(this.channel.game.makeCurrentGameEmbed())
  }

}
module.exports = GameWhatCommand;