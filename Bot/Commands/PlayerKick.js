const BaseCommand = require("./Base.js");

class PlayerKickCommand extends BaseCommand {
  static command = ["Kick", "Purge"];
  static helpTitle = "Removes a player from the game. This deletes old rolls.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <@Player>`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster() && this.userIsNotMod()) {
        return await this.reply(`You are not the GM of this game.`)
    }

    this.mentionedUser = this.getMentionedUser();
    if (!this.mentionedUser) {
      return await this.reply(`Try again while mentioning a Player.`)
    }

    this.kickedPlayer = this.channel.getPlayer(this.mentionedUser);
    if (!this.kickedPlayer) {
      return await this.reply(`This user is not playing this game.`);
    }

    let name = this.kickedPlayer.name || this.kickedPlayer.user.ping();
    await this.getTurn().deletePlayer(this.kickedPlayer);
    await this.save();
    await this.reply(`${name} has been removed from the game.`);
  }

}
module.exports = PlayerKickCommand;