const BaseCommand = require("./Base.js");

class HistoryCommand extends BaseCommand {
  static command = ["Played", "P", "Rolls", "History"];
  static helpTitle = "Shows the rolls and intentions this turn.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} [@Player]`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    this.mentionedUser = this.getMentionedUser();
    if (this.mentionedUser) {
      return this.playerHistory();
    }
    await this.reply(this.getTurn().makeEntireHistoryText())
    await this.addDeleteReactionToReply();
    await this.waitReplyReaction();
  }

  async playerHistory() {
    this.player = this.getTurn().getPlayer(this.mentionedUser);
    if (!this.player) {
      return await this.reply(`This user is not playing this game.`)
    }
    const turn = this.channel.game.turn;
    await this.reply(this.player.makeHistoryText());
    await this.addDeleteReactionToReply();
    await this.waitReplyReaction();
  }
}
module.exports = HistoryCommand;