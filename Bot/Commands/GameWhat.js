const BaseCommand = require("./Base.js");

class GameWhatCommand extends BaseCommand {
  static command = ["Game", "Current", "G"];
  static helpTitle = "Checks the game being hosted in the current channel.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]}`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    this.index = this.channel.game.turn;
    this.showDescription = false;
    await this.reply(this.channel.game.makeCurrentGameEmbed(this.index));
    await this.addDeleteReactionToReply();
    await this.addShowDescriptionReaction();
    await this.addPageReactions();
  }
  
  async editReply() {
    const embed = this.channel.game.makeCurrentGameEmbed(this.index, this.showDescription);
    await this.reply.edit(embed);
    await this.addPageReactions();
  }

  async addPageReactions() {
    await this.addPreviousPageReactionToReply();
    await this.addNextPageReactionToReply();
    await this.waitReplyReaction();
  }

  async addNextPageReactionToReply() {
    if (this.index < this.channel.game.turn) {
      await this.reply.react(BaseCommand.nextReactionEmoji);
      this.reactions[BaseCommand.nextReactionEmoji] = this.nextPage;
    } else {
      delete this.reactions[BaseCommand.nextReactionEmoji];
    }
  }

  async addPreviousPageReactionToReply() {
     if (this.index > 0) {      
      await this.reply.react(BaseCommand.previousReactionEmoji);
      this.reactions[BaseCommand.previousReactionEmoji] = this.previousPage;
    } else {    
      delete this.reactions[BaseCommand.previousReactionEmoji]
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