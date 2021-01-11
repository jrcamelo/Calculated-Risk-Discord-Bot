const BaseCommand = require("./Base.js");

class HistoryPlayerCommand extends BaseCommand {
  static command = ["Rolls"];
  static helpTitle = "Shows the rolls and intentions of a Player this turn.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <@Player>`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    this.mentionedUser = this.getMentionedUser();
    if (!this.mentionedUser) {
      return await this.reply(`Try mentioning a player.`)
    }
    this.player = this.channel.game.getPlayer(this.mentionedUser);
    if (!this.player) {
      return await this.reply(`This user is not playing this game.`)
    }
    const turn = this.channel.game.turn;
    await this.reply(this.player.describeTurnRolls(turn));
    await this.addDeleteReactionToReply();
    await this.waitReplyReaction();
  }
}
module.exports = HistoryPlayerCommand;