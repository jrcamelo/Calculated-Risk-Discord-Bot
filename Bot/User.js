const AniListNode = require("../ModifiedAniListNode/");
const Discord = require("discord.js")
const Bot = require("./Bot")

const AniList = new AniListNode();

module.exports = class User {
  constructor(channel, discord, anilist) {
    this.channel = channel;
    this.discord = discord;
    this.anilist = anilist;
  }

  setChannel(message) {
    let channel = message.author;
    if (message.channel && message.channel.id) {
      channel = message.channel.id
    }    
    this.channel = channel;
    return this.channel;
  }
  
  setDiscordFromMessage(message) {
    this.discord = message.author;
    this.setChannel(message);
    return this.discord;
  }

  async setDiscordFromSearch(message, text) {
    if (await this.setDiscordFromMention(message) ||
        await this.setDiscordFromId(message, text.toLowerCase()) ||
        await this.setDiscordFromName(message, text.toLowerCase())) {
      return this.discord;
    }
  }

  async setDiscordFromMention(message) {
    if (message.mentions && 
        message.mentions.users &&
        message.mentions.users.size) {
      this.discord = message.mentions.users.values().next().value;
      this.setChannel(message);
      return this.discord;
    }
  }

  async setDiscordFromId(message, id) {    
    if (!message.channel) return null;
    const fromId = message.channel.members.cache.get(id);
    if (!fromId) return null;
    this.discord = fromId.user;
    this.setChannel(message);
    return this.discord;
  }

  async setDiscordFromName(message, name) {    
    if (!message.channel) return null;
    const idFromName = message.channel.members.cache.find(
      member => (member.user.username.toLowerCase().includes(name) || 
                (member.nickname && member.nickname.toLowerCase().includes(name))) );
    if (!idFromName) return null;
    const id = idFromName.id;
    return await this.setDiscordFromId(message, id);
  }

  makeAniListProfileEmbed() {
    return new Discord.MessageEmbed()
      .setColor(this.getAniListProfileColor())
      .setTitle(this.anilist.name)
      .setURL(this.anilist.siteUrl)
      .setThumbnail(this.anilist.avatar.large)
      .setImage(this.anilist.bannerImage)
      .addFields(this.makeStatisticsFields())
      .setFooter(this.discord.username + " added as " + this.anilist.name, this.getDiscordAvatarUrl());
  }

  getDiscordAvatarUrl() {
    if (this.discord == null) return null;
    return User.makeDiscordAvatarUrl(this.discord);

  }

  static makeDiscordAvatarUrl(discordUser) {
    const url = "https://cdn.discordapp.com/avatars/"
    return url + discordUser + "/" + discordUser.avatar + ".png";
  }

  async saveRoll() {
    if (this.discord) {
      return await Bot.db.addRoll(this.discord);
    }
  }

  async saveRollToChannel() {
    if (this.discord && this.channel) {
      return await Bot.db.addRollToChannel(this.discord, this.channel);
    }
  }
}