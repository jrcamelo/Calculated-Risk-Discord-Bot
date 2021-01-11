const BaseCommand = require("./Base.js");

class ClaimCommand extends BaseCommand {
  static command = ["Claim", "Join", "Rename", "Play"];
  static helpTitle = "Joins the current game as a player or rename your faction."
  static helpDescription = `${BaseCommand.prefix + this.command[0]} <Name of your Faction>`

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.reply(`There is currently no game being hosted in this channel.`);
    }
    this.loadPlayer();
    if (this.playerIsDead()) {
        return await this.reply(`You have already died.`);
    }    

    const factionName = this.arg || "";
    await this.channel.game.addPlayer(this.message.author, factionName);
    await this.save();
    await this.reply(this.channel.game.makeCurrentGameEmbed());
    await this.addDeleteReactionToReply();
    await this.waitReplyReaction();
  }

}
module.exports = ClaimCommand;