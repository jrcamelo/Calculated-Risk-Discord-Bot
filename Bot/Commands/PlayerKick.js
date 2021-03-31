const BaseCommand = require("./Base.js");
const Discord = require("discord.js");

class PlayerKickCommand extends BaseCommand {
  static command = ["Kick", "Purge"];
  static helpTitle = "Removes a player from the game. You can also kick yourself.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]} <@Player>`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }

    this.mentionedUser = this.getMentionedUser() || this.getTurn().getPlayer({id: this.args});
    if (!this.mentionedUser) {
      return await this.sendReplyWithDelete(`Try again while mentioning a Player.`)
    }

    if (this.userIsNotMaster() && this.mentionedUser != this.message.author) {
        return await this.sendReplyWithDelete(`You are not the GM of this game.`)
    }

    this.kickedPlayer = this.channel.getPlayer(this.mentionedUser) || this.getTurn().getPlayer({id: this.args});
    if (!this.kickedPlayer) {
      return await this.sendReplyWithDelete(`This user is not playing this game.`);
    }

    let name = this.kickedPlayer.name || this.kickedPlayer.user.ping();
    await this.getTurn().deletePlayer(this.kickedPlayer);
    await this.save();
    await this.sendReply(`${name} has fallen and will be removed next turn.`);
  }
}
module.exports = PlayerKickCommand;