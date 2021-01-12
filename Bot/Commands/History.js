const BaseCommand = require("./Base.js");

class HistoryCommand extends BaseCommand {
  static command = ["Played", "P", "History"];
  static helpTitle = "Shows the rolls and intentions this turn.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]}`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    await this.reply(this.getTurn().makeHistoryText())
    await this.addDeleteReactionToReply();
    await this.waitReplyReaction();
  }
}
module.exports = HistoryCommand;