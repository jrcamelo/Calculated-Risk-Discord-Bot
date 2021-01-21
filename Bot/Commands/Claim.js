const BaseCommand = require("./Base.js");

class ClaimCommand extends BaseCommand {
  static command = ["Claim", "Join", "Rename", "Play"];
  static helpTitle = "Joins the current game as a player or rename your faction."
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]} <Name of your Faction>` }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReply(`There is currently no game being hosted in this channel.`);
    }
    this.loadPlayer();
    if (this.playerIsDead()) {
        return await this.sendReply(`You have already died.`);
    }    

    const factionName = this.arg || "";
    this.newPlayer = await this.getTurn().addPlayer(this.message.author, factionName);
    await this.save();
    await this.sendReply(`${this.newPlayer.describeName()} has joined the game.`);
  }

}
module.exports = ClaimCommand;