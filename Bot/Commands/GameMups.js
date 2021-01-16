const BaseCommand = require("./Base.js");

class GameMupsCommand extends BaseCommand {
  static command = ["AllMups", "Mups"];
  static helpTitle = "Shows a list of all the mups.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]}`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    await this.reply(this.getGame().makeListOfMups());
    await this.addDeleteReactionToReply();
    await this.waitReplyReaction();
  }
}
module.exports = GameMupsCommand;