const BaseCommand = require("./Base.js");

class GameEndCommand extends BaseCommand {
  static command = ["EndGame", "FinishGame"];
  static helpTitle = "Finishes the current running game. Can only be used by the GM or a user with Manage Messages permission.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]}`

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster() && this.userIsNotMod()) {
        return await this.reply(`You are not the GM of this game.`)
    }
    const oldGame = this.channel.finishGame();
    await this.save();
    return await this.reply(`${oldGame.name} has been finished.`)
  }

}
module.exports = GameEndCommand;