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
    await this.sendReply(this.channel.game.makeCurrentGameEmbed(null, true))
    await this.waitReplyReaction();
    await this.pingPlayers();
  }

  changeMup(description, attachment) {
    this.getGame().nextTurn(attachment, description);
  }

  async pingPlayers() {
    return await this.sendAdditionalReply(this.getTurn().pingNotPlayed());
  }

  async editReply() {
    const embed = this.getGame().makeCurrentGameEmbed(null);
    await this.reply.edit(embed);
    await this.waitReplyReaction();
  }
}
module.exports = MupCommand;