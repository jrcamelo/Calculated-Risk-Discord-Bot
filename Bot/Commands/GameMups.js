const BaseCommand = require("./Base.js");

class GameMupsCommand extends BaseCommand {
  static command = ["AllMups", "Mups"];
  static helpTitle = "Shows a list of all the mups.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]}`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    await this.sendReplyWithDelete(this.getGame().makeListOfMups());
    if (this.getGame().currentTurn > 10) {
      this.index = 0;
      this.addNextReactionToReply(this.nextPage);
    }
  }

  async nextPage(_collected, command) {
    command.index += 10;
    await command.editReply();
  }

  async editReply() {
    if (this.index > this.getGame().currentTurn) {
      this.index = 0;
    }
    const embed = this.getGame().makeListOfMups(this.index)
    await this.reply.edit(embed);
    await this.waitReplyReaction();
  }

}
module.exports = GameMupsCommand;