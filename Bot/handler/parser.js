const { requireCommands } = require("../utils/file")

const PREFIX = process.env.PREFIX

module.exports = class Parser {
  static commands = {}

  static readCommands() {
    for (const commandType of requireCommands()) {
      if (commandType.name == null) continue
      Parser.commands[commandType.name.toLowerCase()] = commandType
      commandType.aliases.forEach(alias => {
        Parser.commands[alias.toLowerCase()] = commandType
      });
    }
  }

  static isValid(message) {
    if (!message || !message.channel || !message.channel.guild) return false;
    if (message.author.bot) return false;
    return message.content.toLowerCase().startsWith(PREFIX);
  }

  constructor(message) {
    this.message = message
    this.splitCommandAndArgs()
    this.setLimitDelete()
  }

  splitCommandAndArgs() {
    const content = this.message.content.slice(PREFIX.length);
    this.args = content.split(" ")
    this.command = this.args.shift().toLowerCase();
  }

  setLimitDelete() {
    this.message.limitDelete = false;
    if (this.command.endsWith("!")) {
      this.message.limitDelete = true;
      this.command = this.command.slice(0, -1);
    }
  }

  getCommand() {
    if (this.command in Parser.commands) {
      const commandType = Parser.commands[this.command]
      return new commandType(this.message, this.args)
    }
  }
}