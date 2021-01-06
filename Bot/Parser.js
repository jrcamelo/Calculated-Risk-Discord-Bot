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
    const Help = require("../AnimeBot/Commands/Help")
    const helpCommands = [];

    this.separateCommandAndArgs();

    switch(this.command.toLowerCase()) {
      case Help.command:
        return new Help(this.message, commands);
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