const BaseCommand = require("./Base.js");

class GameWhatCommand extends BaseCommand {
  static command = ["Game", "Current", "G"];
  static helpTitle = "Checks the game being hosted in the current channel.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]}`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    this.index = this.getGame().currentTurn;
    this.showDescription = false;
    await this.reply(this.getGame().makeCurrentGameEmbed(this.index));
    await this.addDeleteReactionToReply();
    await this.addShowDescriptionReaction();
    await this.addPageReactions();
  }
  
  async editReply() {
    const embed = this.getGame().makeCurrentGameEmbed(this.index, this.showDescription);
    await this.reply.edit(embed);
    await this.addPageReactions();
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

  async addShowDescriptionReaction() {
    await this.reply.react(BaseCommand.plusReactionEmoji);
    this.reactions[BaseCommand.plusReactionEmoji] = this.showDescriptionTrigger;
  }

  async nextPage(_collected, command) {
    command.index += 1;
    await command.editReply();
  }

  async previousPage(_collected, command) {
    command.index -= 1;
    await command.editReply();
  }

  async showDescriptionTrigger(_collected, command) {
    command.showDescription = !command.showDescription;
    await command.editReply();
  }
}
module.exports = GameWhatCommand;