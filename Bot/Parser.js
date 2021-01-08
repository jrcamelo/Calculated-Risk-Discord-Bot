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
    const Claim = require("./Commands/Claim")
    const Mup = require("./Commands/Mup")
    const Roll = require("./Commands/Roll")
    const RollId = require("./Commands/RollId")
    const RollUntracked = require("./Commands/RollUntracked")
    const RollUntrackedId = require("./Commands/RollUntrackedId")
    const commands = [GameStart, GameEnd, GameWhat, Claim, Mup, Roll, RollId, RollUntracked, RollUntrackedId];

    this.separateCommandAndArgs();

    if (Help.isRequestedCommand(this.command)) {
        return new Help(this.message, commands);
    }

    for (let botCommand of commands) {
      if (botCommand.isRequestedCommand(this.command)) {
        return new botCommand(this.message, this.args, this.command)
      }
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