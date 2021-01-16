const BaseCommand = require("./Base.js");

class PlayerUnrollCommand extends BaseCommand {
  static command = ["Unroll", "Undo", "UN"];
  static helpTitle = "Cancels the first roll of the player this turn.";
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

    this.unrolledPlayer = this.channel.getPlayer(this.mentionedUser);
    if (!this.unrolledPlayer) {
      return await this.reply(`This user is not playing this game.`);
    }
    if (this.unrolledPlayer.rolled == false) {
      return await this.reply(`You can't undo what has not been done yet.`);
    }

    await this.getTurn().unrollPlayer(this.unrolledPlayer);
    await this.save();
    this.reply = await this.reply(`Current roll: ${this.unrolledPlayer.describeFirstRoll() || "Needs to roll"}`);
  }

}
module.exports = PlayerUnrollCommand;