const BaseCommand = require("./Base.js");

class FinishGameCommand extends BaseCommand {
  static command = "finishgame";

  constructor(message, args) {
    super(message, args);
  }

  async execute() {
    this.game.name = "AAAAA"
    if (this.game == null) {
        return await this.reply(`There is no ongoing game in this channel.`)
    }
    const oldGame = this.channel.finishGame();
    await this.channel.save();
    return await this.reply(`${oldGame.name} has been finished.`)
  }

}
module.exports = FinishGameCommand;