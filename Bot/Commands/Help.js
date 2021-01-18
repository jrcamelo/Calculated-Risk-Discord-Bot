const BaseCommand = require("./Base.js");
const Discord = require("discord.js");
const Bot = require("../Bot");

class HelpCommand extends BaseCommand {
  static command = ["Help", "H", "?"];

  constructor(message, commands) {
    super(message, []);
    this.playerCommands = commands.player;
    this.masterCommands = commands.master;
    this.pages = []
    this.index = 0;
  }

  async execute() {
    let player = []
    for (let command of this.playerCommands) {     
      player.push(this.makeCommandField(command));
    }
    let master = []
    for (let command of this.masterCommands) {     
      master.push(this.makeCommandField(command));
    }

    this.embeds = [
      this.makeEmbed(player, "List of Player Commands"), 
      this.makeEmbed(master, "List of Game Master Commands"),
    ];
    await this.sendReply(this.embeds[this.index]);
    await this.addReactions();
  }
  
  async editReply() {
    const embed = this.embeds[this.index];
    await this.reply.edit(embed);
    await this.addReactions();
  }

  async addReactions() {
    await this.addDeleteReactionToReply();
    await this.addNextPageReactionToReply();
    await this.waitReplyReaction();
  }

  async addNextPageReactionToReply() {
    await this.reply.react(BaseCommand.nextReactionEmoji);
    this.reactions[BaseCommand.nextReactionEmoji] = this.nextPage;
  }

  async nextPage(_collected, command) {
    const limit = command.embeds.length
    command.index = (limit + command.index + 1) % limit;
    await command.editReply();
  }

  makeCommandField(command) {
    let description = command.helpDescription();
    if (command.command.length > 1) {
      for (let alternative of command.command) {
        if (alternative == command.command[0]) {
          description += " "
        } else {
          description += ` | ${command.prefix}${alternative}`;
        }
      }
    }
    return {
      name: description,
      value: command.helpTitle,
      inline: false
    };
  }

  makeEmbed(commands, text) {
    return new Discord.MessageEmbed()
      .setColor("#26edff")
      .setAuthor("Calculated Risk - Bot for Risk games", Bot.getProfilePicture())
      .setDescription(text)
      .setThumbnail("https://i.imgur.com/pIr8hmb.jpg")
      .setFooter("Made by jrlol3", "https://cdn.discordapp.com/avatars/464911746088304650/b4cf2c3e345edcfe9b329611ccce509b.png")
      .addFields(commands);
  }
}
module.exports = HelpCommand;