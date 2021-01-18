const BaseCommand = require("./Base.js");
const Discord = require("discord.js");

class PlayerUnrollCommand extends BaseCommand {
  static command = ["Unroll", "Undo", "UN"];
  static helpTitle = "Cancels the first roll of the player this turn.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]} <@Player>`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster()) {
        return await this.sendReplyWithDelete(`You are not the GM of this game.`)
    }

    this.mentionedUser = this.getMentionedUser();
    if (!this.mentionedUser) {
      return await this.sendReplyWithDelete(`Try again while mentioning a Player.`)
    }

    this.unrolledPlayer = this.channel.getPlayer(this.mentionedUser);
    if (!this.unrolledPlayer) {
      return await this.sendReplyWithDelete(`This user is not playing this game.`);
    }
    if (this.unrolledPlayer.rolled == false) {
      return await this.sendReplyWithDelete(`You can't undo what has not been done yet.`);
    }

    await this.getTurn().unrollPlayer(this.unrolledPlayer);
    await this.save();

    let embed = new Discord.MessageEmbed()
      .setAuthor(`${this.unrolledPlayer.user.username}'s current roll`, this.unrolledPlayer.user.avatar)
      .setDescription(`${this.unrolledPlayer.describeFirstRoll() || "Needs to roll"}`)
    this.reply = await this.sendReply(embed);
    await this.addDeleteReactionToReply();
    await this.waitReplyReaction();
  }

}
module.exports = PlayerUnrollCommand;