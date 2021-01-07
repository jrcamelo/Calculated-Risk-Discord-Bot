const User = require("./User");
const Discord = require('discord.js');

module.exports = class Game {
  create(user, name) {    
    this.name = name;
    this.master = new User().create(user);
    this.turn = 0;
    this.mups = [];
    this.players = [];
    this.startedAt = Date.now();
    this.endedAt = null;
    return this;
  }
  
  load(hash) {
    if (!hash) {
      return null;
    }
    this.name = hash.name;
    this.master = new User().load(hash.master);
    this.turn = hash.turn;
    this.mups = hash.mups;
    this.players = hash.players;
    this.startedAt = hash.startedAt;
    this.endedAt = hash.endedAt;
    return this;
  }
  
  finish() {
    this.endedAt = Date.now();
  }

  addPlayer(discordUser) {

  }

  lastMup() {
    if (this.mups.length) {
      return this.mups[0]
    }
    return null
  }

  makeCurrentGameEmbed() {
    let embed = new Discord.MessageEmbed()
      .setColor('#c90040')
      .setTitle(this.name)
      .setAuthor(`Game Master: ${this.master.username}`, this.master.avatar)
      .addFields(this.makeGameFields())
      .setDescription(this.makePlayerList())
    if (this.lastMup()) {
      embed.setImage(this.lastMup());
    }
    return embed;
  }

  makeGameFields() {    
    return [
        { name: `Turn`, value: this.turn, inline: true },
        { name: "Started at", value: new Date(this.startedAt).toDateString(), inline: true }
    ]    
  }

  makePlayerList() {
    if (!this.players.length) {
      return "No players"
    }
    let text = "Players:"
    for (let player of this.players) {      
      text += `\n  ${player.username}`
      if (player.name) {
        text += `as ${player.name}`
      }
    }
    return text;
  }


}