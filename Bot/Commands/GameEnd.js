const BaseCommand = require("./Base.js");

class GameEndCommand extends BaseCommand {
  static command = "EndGame";
  static helpTitle = "Finishes the current running game. Can only be used by the GM or a user with Manage Messages permission.";
  static helpDescription = `${BaseCommand.prefix + this.command}`

  constructor(message, args) {
    super(message, args);
  }

  async execute() {
    if (this.game == null) {
        return await this.reply(`There is currently no game being hosted in this channel.`)
    }        
    const oldGame = this.channel.finishGame();
    await this.channel.save();
    return await this.reply(`${oldGame.name} has been finished.`)
  }

}
module.exports = GameEndCommand;