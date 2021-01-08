const BaseCommand = require("./Base.js");
const Discord = require("discord.js");
const Bot = require("../Bot");

class HelpCommand extends BaseCommand {
  static command = ["Help", "H", "?"];

  async execute() {
    const fields = [];
    for (let i in this.args) {      
      fields.push(this.makeCommandField(this.args[i]));
    }

    const embed = this.makeEmbed(fields);
    return this.reply(embed);
  }

  makeCommandField(command) {
    let description = command.helpDescription;
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

  makeEmbed(fields) {
    return new Discord.MessageEmbed()
      .setColor("#26edff")
      .setAuthor("How to use the bot", Bot.getProfilePicture())
      .setDescription("Bot to help manage and play Risk games in Discord.")
      .setThumbnail("https://i.imgur.com/pIr8hmb.jpg")
      .setFooter("Made by jrlol3", "https://cdn.discordapp.com/avatars/464911746088304650/b4cf2c3e345edcfe9b329611ccce509b.png")
      .addFields(fields);
  }
}
module.exports = HelpCommand;