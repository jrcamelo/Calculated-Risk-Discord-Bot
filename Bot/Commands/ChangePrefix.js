const BaseCommand = require("./Base.js");
const Bot = require("../Bot");

class ChangePrefixCommand extends BaseCommand {
  static command = ["ChangePrefix", "Prefix"];
  static helpTitle = "Changes the Prefix for the bot in this server. (Mod command)";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <Prefix>`

  async execute() {
    if (this.isArgsBlank()) {
      return await this.replyWithDelete("Try again with a prefix.")
    }
    if (this.userIsNotMod()) {
        return await this.replyWithDelete(`You do not have permission to do this.`)
    }
    let prefix = this.args[0].toLowerCase();
    let server = this.message.channel.guild.id;
    await this.db.savePrefix(server, prefix);
    Bot.updateSavedPrefix(server);
    await this.replyWithDelete(`Prefix changed to ${prefix}, try ${prefix}help`);
  }

}
module.exports = ChangePrefixCommand;