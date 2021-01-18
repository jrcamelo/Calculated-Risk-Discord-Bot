const BaseCommand = require("./Base.js");

class PlayerNotRolledCommand extends BaseCommand {
  static command = ["Who", "NotRolled", "Not"];
  static helpTitle = "Lists every player who is alive and has not rolled.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]}`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    return await this.sendReply(this.getTurn().listNotPlayed());
  }

}
module.exports = PlayerNotRolledCommand;