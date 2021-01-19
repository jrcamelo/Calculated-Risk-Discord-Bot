const BaseCommand = require("./Base.js");

class MupCommand extends BaseCommand {
  static command = ["Mupdate", "Mup", "Turn"];
  static helpTitle = "Starts next turn with an image and description.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]} <Description> {Image}`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster()) {
        return await this.sendReplyWithDelete(`You are not the GM of this game.`)
    }
    this.changeMup(this.arg, this.getMessageAttachment());
    this.save();
    await this.sendReply(this.channel.game.makeCurrentGameEmbed())
    await this.addShowDescriptionReaction();
    await this.waitReplyReaction();
    await this.sendAdditionalReply(this.getTurn().pingNotPlayed());
  }

  changeMup(description, attachment) {
    this.getGame().nextTurn(attachment, description);
  }

  async addShowDescriptionReaction() {
    await this.reply.react(BaseCommand.plusReactionEmoji);
    this.reactions[BaseCommand.plusReactionEmoji] = this.showDescriptionTrigger;
  }
  
  async showDescriptionTrigger(_collected, command) {
    command.showDescription = !command.showDescription;
    await command.editReply();
  }

  async editReply() {
    const embed = this.getGame().makeCurrentGameEmbed(null, this.showDescription);
    await this.reply.edit(embed);
    await this.waitReplyReaction();
  }
}
module.exports = MupCommand;