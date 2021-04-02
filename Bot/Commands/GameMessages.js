const BaseCommand = require("./Base.js");

class GameMessagesCommand extends BaseCommand {
  static command = ["Messages", "Links"];
  static helpTitle = "Gets all roll links for the current turn.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]}`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReply(`There is currently no game being hosted in this channel.`)
    }
    this.index = 0;
    await this.sendReply(this.getEmbed());
    await this.addDeleteReactionToReply();
    await this.addPageReactions();
  }

  getEmbed() {
    return this.getTurn().getAllRollLinksEmbed(this.index);
  }
  
  async editReply() {
    await this.reply.edit(this.getEmbed());
    await this.addPageReactions();
  }

  async addPageReactions() {
    await this.addNextReactionToReply(this.nextPage);
    await this.waitReplyReaction();
  }

  async nextPage(_collected, command) {
    command.index += 10;
    await command.editReply();
  }
}
module.exports = GameMessagesCommand;