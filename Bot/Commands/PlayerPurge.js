const BaseCommand = require("./Base.js");
const Discord = require("discord.js");

class PlayerPurgeCommand extends BaseCommand {
  static command = ["Purge"];
  static helpTitle = "Removes a player from the game instantly.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]} <@Player>`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }

    this.mentionedUser = this.getMentionedUser() || this.getTurn().getPlayer({id: this.args});
    if (!this.mentionedUser) {
      return await this.sendReplyWithDelete(`Try again while mentioning a Player.`)
    }

    if (this.userIsNotMaster()) {
        return await this.sendReplyWithDelete(`You are not the GM of this game.`)
    }

    this.kickedPlayer = this.channel.getPlayer(this.mentionedUser) || this.getTurn().getPlayer({id: this.args});
    if (!this.kickedPlayer) {
      return await this.sendReplyWithDelete(`This user is not playing this game.`);
    }

    let name = this.kickedPlayer.name || this.kickedPlayer.user.ping();
    await this.getTurn().deletePlayerInstantly(this.kickedPlayer);
    await this.save();
    await this.sendReply(`${name} was removed.`);
  }
}
module.exports = PlayerPurgeCommand;