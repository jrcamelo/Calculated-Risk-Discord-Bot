const BaseCommand = require("./Base.js");

class PlayerKillCommand extends BaseCommand {
  static command = ["Kill", "Dead"];
  static helpTitle = "Marks a player as dead.";
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

    this.killedPlayer = this.channel.getPlayer(this.mentionedUser);
    if (!this.killedPlayer) {
      return await this.sendReplyWithDelete(`This user is not playing this game.`);
    }
    if (this.killedPlayer.alive == false) {
      return await this.sendReplyWithDelete(`Stop! Stop! They're already dead!`);
    }

    await this.getTurn().killPlayer(this.killedPlayer);
    await this.save();
    let name = this.killedPlayer.name || this.killedPlayer.user.ping();
    this.reply = await this.sendReply(`${name} is no more. Press F to pay respects.`);
    this.reply.react(BaseCommand.fReactionEmoji);
  }

}
module.exports = PlayerKillCommand;