const BaseCommand = require("./Base.js");

class PlayerReviveCommand extends BaseCommand {
  static command = ["Revive", "Ressurrect", "Res"];
  static helpTitle = "Brings a player back from the dead.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <@Player>`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.replyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster()) {
        return await this.replyWithDelete(`You are not the GM of this game.`)
    }

    this.mentionedUser = this.getMentionedUser();
    if (!this.mentionedUser) {
      return await this.replyWithDelete(`Try again while mentioning a Player.`)
    }

    this.revivedPlayer = this.channel.getPlayer(this.mentionedUser);
    if (!this.revivedPlayer) {
      return await this.replyWithDelete(`This user is not playing this game.`);
    }
    if (this.revivedPlayer.alive == true) {
      return await this.replyWithDelete(`Stop! Stop! They're already alive!`);
    }

    await this.getTurn().revivePlayer(this.revivedPlayer);
    await this.save();
    let name = this.revivedPlayer.name || this.revivedPlayer.user.ping();
    this.reply = await this.reply(`${name} is back. To live is to suffer.`);
    this.reply.react(BaseCommand.fReactionEmoji);
  }

}
module.exports = PlayerReviveCommand;