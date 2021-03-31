const BaseCommand = require("./Base.js");

class GameWhatCommand extends BaseCommand {
  static command = ["Game", "Current", "G"];
  static helpTitle = "Checks the game being hosted in the current channel.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]}`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReply(`There is currently no game being hosted in this channel.`)
    }
    this.index = this.getGame().currentTurn;
    this.showDescription = false;
    await this.sendReply(this.getEmbed());
    await this.addDeleteReactionToReply();
    await this.addShowDescriptionReaction();
    await this.addPageReactions();
  }

  getEmbed() {
    let embed = this.getGame().makeCurrentGameEmbed(this.index, this.showDescription);
    if (embed.length > 2048) {
      embed = this.getGame().makeCurrentGameEmbedCompact(this.index, this.showDescription);
    }
    if (embed.length > 2048) {
      // TODO: Remove links
      embed = "Game description too long, can't send message";
    }
    return embed;
  }
  
  async editReply() {
    await this.reply.edit(this.getEmbed());
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