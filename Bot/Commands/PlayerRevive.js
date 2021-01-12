const BaseCommand = require("./Base.js");

class PlayerReviveCommand extends BaseCommand {
  static command = ["Revive", "Ressurrect", "Res"];
  static helpTitle = "Brings a player back from the dead.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <@Player>`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster()) {
        return await this.reply(`You are not the GM of this game.`)
    }

    this.mentionedUser = this.getMentionedUser();
    if (!this.mentionedUser) {
      return await this.reply(`Try again while mentioning a Player.`)
    }

    this.revivedPlayer = this.channel.getPlayer(this.mentionedUser);
    if (!this.revivedPlayer) {
      return await this.reply(`This user is not playing this game.`);
    }
    if (this.revivedPlayer.alive == true) {
      return await this.reply(`Stop! Stop! They're already alive!`);
    }

    this.getTurn().revivePlayer(this.revivedPlayer);
    this.save();
    let name = this.revivedPlayer.factioname || this.revivedPlayer.user.ping();
    this.reply = await this.reply(`${name} is back. To live is to suffer.`);
    this.reply.react(BaseCommand.fReactionEmoji);
  }

}
module.exports = PlayerReviveCommand;