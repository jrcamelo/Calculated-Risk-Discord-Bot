const BaseCommand = require("./Base.js");

class MupCommand extends BaseCommand {
  static command = ["Mup", "Turn", "Next"];
  static helpTitle = "Updates the Mup image and goes to the next turn.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <Mup Image Link>`;

  async execute() {
    if (this.channel.game == null) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    if (this.channel.game.master.id != this.message.author.id) {
        return await this.reply(`You are not the GM of this game.`)
    }
    this.channel.game.mup(this.arg);
    this.save();
    return await this.reply(this.channel.game.makeCurrentGameEmbed())
  }

}
module.exports = MupCommand;