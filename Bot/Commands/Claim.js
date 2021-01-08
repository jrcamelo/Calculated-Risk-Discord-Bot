const BaseCommand = require("./Base.js");

class ClaimCommand extends BaseCommand {
  static command = ["Claim", "Join", "Rename", "Play"];
  static helpTitle = "Joins the current game as a player or rename your faction."
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <Name of your Faction>`

  async execute() {    
    if (this.channel.game == null) {
        return await this.reply(`There is currently no game being hosted in this channel.`);
    }

    const factionName = this.arg || "";
    await this.channel.game.addPlayer(this.message.author, factionName);
    await this.save();
    return await this.reply(this.channel.game.makeCurrentGameEmbed());
  }

}
module.exports = ClaimCommand;