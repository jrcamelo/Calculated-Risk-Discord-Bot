const BaseCommand = require("./Base.js");

class MupCommand extends BaseCommand {
  static command = ["Mup", "Turn", "Next"];
  static helpTitle = "Updates the Mup, can add an image and description, and starts the next turn.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <Description> {Image Attachment}`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster()) {
        return await this.reply(`You are not the GM of this game.`)
    }
    this.changeMup(this.arg, this.getMessageAttachment());
    this.save();
    await this.reply(this.channel.game.makeCurrentGameEmbed())
    await this.addDeleteReactionToReply();
    await this.waitReplyReaction();
  }

  changeMup(description, attachment) {
    this.getGame().nextTurn(description, attachment);
  }

}
module.exports = MupCommand;