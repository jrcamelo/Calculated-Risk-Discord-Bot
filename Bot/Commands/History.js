const BaseCommand = require("./Base.js");

class HistoryCommand extends BaseCommand {
  static command = ["Played", "P", "Rolls", "History"];
  static helpTitle = "Shows the rolls and intentions this turn.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]} [@Player]`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    this.mentionedUser = this.getMentionedUser();
    if (this.mentionedUser) {
      return this.playerHistory();
    }
    await this.sendReplyWithDelete(this.getTurn().makeEntireHistoryText())
  }

  async playerHistory() {
    this.player = this.getTurn().getPlayer(this.mentionedUser);
    if (!this.player) {
      return await this.sendReplyWithDelete(`This user is not playing this game.`)
    }
    const turn = this.channel.game.turn;
    await this.sendReplyWithDelete(this.player.makeHistoryText());
  }
}
module.exports = HistoryCommand;