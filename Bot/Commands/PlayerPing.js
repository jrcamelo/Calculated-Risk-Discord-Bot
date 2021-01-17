const BaseCommand = require("./Base.js");

class PlayerPingCommand extends BaseCommand {
  static command = ["Ping", "Everyone", "All", "@"];
  static helpTitle = "Pings every player who is alive and has not rolled.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]}`;

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.replyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster() && this.userIsNotMod()) {
        return await this.replyWithDelete(`You are not the GM of this game.`)
    }
    return await this.reply(this.getTurn().pingNotPlayed());
  }

}
module.exports = PlayerPingCommand;