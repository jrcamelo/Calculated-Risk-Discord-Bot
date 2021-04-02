const BaseCommand = require("./Base.js");

class HistoryCommand extends BaseCommand {
  static command = ["Played", "P", "Rolls", "History"];
  static helpTitle = "Shows the rolls and intentions this turn.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]} [@Player]`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    this.mentionedUser = this.getMentionedUser();
    if (this.mentionedUser) {
      this.player = this.getTurn().getPlayer(this.mentionedUser);
      if (!this.player) {
        return await this.sendReplyWithDelete(`This user is not playing this game.`)
      }
      return await this.sendReplyWithDelete(this.player.makeHistoryText());
    }    

    this.index = this.getGame().currentTurn;
    await this.sendReply(this.getHistory());
    await this.addDeleteReactionToReply();
    await this.addPageReactions();
  }

  async editReply() {
    await this.reply.edit(this.getHistory());
    await this.addPageReactions();
  }

  getHistory() {
    let history = this.getTurn(this.index).makeEntireHistoryText();
    if (history.length > 2048) {
      return this.getTurn(this.index).makeEntireHistoryText(true);
    }
    return history;
  }

  async addPageReactions() {
    await this.addPrevious();
    await this.addNext();
    await this.waitReplyReaction();
  }

  async addNext() {
    if (this.index < this.getGame().currentTurn) {
      await this.addNextReactionToReply(this.nextPage);
    } else {
      this.cancelNextReactionToReply();
    }
  }

  async addPrevious() {
     if (this.index > 0) {      
      await this.addPreviousReactionToReply(this.previousPage);
    } else {    
      this.cancelPreviousReactionToReply();
    }
  }

  async nextPage(_collected, command) {
    command.index += 1;
    await command.editReply();
  }

  async previousPage(_collected, command) {
    command.index -= 1;
    await command.editReply();
  }
}
module.exports = HistoryCommand;