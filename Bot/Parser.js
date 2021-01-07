class Parser {
  static prefix = "r."
  constructor(message) {
    this.message = message;
  }

  static isValidMessage(message) {
    if (message.author.bot) return false;
    if (!message.content.toLowerCase().startsWith(Parser.prefix)) return false;
    return true;
  }

  parse() {
    const Help = require("./Commands/Help")
    const GameStart = require("./Commands/GameStart")
    const GameEnd = require("./Commands/GameEnd")
    const GameWhat = require("./Commands/GameWhat")
    const helpCommands = [];

    this.separateCommandAndArgs();

    switch(this.command.toLowerCase()) {
      case Help.command.toLowerCase():
        return new Help(this.message, commands);
        break;
      case GameStart.command.toLowerCase():
        return new GameStart(this.message, this.args)
        break;
      case GameEnd.command.toLowerCase():
        return new GameEnd(this.message, this.args)
        break;
      case GameWhat.command.toLowerCase():
        return new GameWhat(this.message, this.args)
        break;
      // case Link.command:
        // return new Link(this.message, this.args)
        // break;
      default:
        break;
    }
  }
  
  async isUserMod() {
    const member = await this.message.guild.member(this.message.author);
    if (member) return await member.hasPermission("MANAGE_MESSAGES");
  }

  separateCommandAndArgs() {
    const commandBody = this.removePrefix();
    this.args = commandBody.split(' ');
    if (this.args.length > 1) {
      this.command = this.args.shift().toLowerCase();
    }
    else {
      this.command = this.args[0]
      this.args = [];
    }
  }

  removePrefix() {
    return this.message.content.slice(Parser.prefix.length);
  }
}
module.exports = Parser