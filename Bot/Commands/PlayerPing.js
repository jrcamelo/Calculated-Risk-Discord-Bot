const BaseCommand = require("./Base.js");

class PlayerPingCommand extends BaseCommand {
  static command = ["Ping", "NotPlayed"];
  static helpTitle = "Pings every player who is alive and has not rolled.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]}`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster()) {
        return await this.sendReplyWithDelete(`You are not the GM of this game.`)
    }
    return await this.ping();
  }

  async ping() {
    return await this.sendReply(this.getTurn().pingNotPlayed());
  }

}
module.exports = PlayerPingCommand;