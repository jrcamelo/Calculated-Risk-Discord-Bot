const BaseCommand = require("./Base.js");

class PlayerReviveCommand extends BaseCommand {
  static command = ["Revive", "Res", "Unkill"];
  static helpTitle = "Brings a player back from the dead.";
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

    this.revivedPlayer = this.channel.getPlayer(this.mentionedUser);
    if (!this.revivedPlayer) {
      return await this.sendReplyWithDelete(`This user is not playing this game.`);
    }
    if (this.revivedPlayer.alive == true) {
      return await this.sendReplyWithDelete(`Stop! Stop! They're already alive!`);
    }

    await this.getTurn().revivePlayer(this.revivedPlayer);
    await this.save();
    let name = this.revivedPlayer.name || this.revivedPlayer.user.ping();
    this.reply = await this.sendReply(`${name} is back. To live is to suffer.`);
    this.reply.react(BaseCommand.fReactionEmoji);
  }

}
module.exports = PlayerReviveCommand;