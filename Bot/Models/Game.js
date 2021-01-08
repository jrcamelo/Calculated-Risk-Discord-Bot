const Discord = require('discord.js');
const User = require("./User");
const Player = require("./Player");
const Mup = require("./Mup");
const Utils = require("../Utils");

module.exports = class Game {
  create(user, name) {    
    this.name = name;
    this.master = new User().create(user);
    this.turn = 0;
    this.mups = [];
    this.players = {};
    this.startedAt = Date.now();
    this.endedAt = null;
    return this;
  }
  
  load(hash) {
    if (hash == null) {
      return null;
    }
    this.name = hash.name;
    this.master = new User().load(hash.master);
    this.turn = hash.turn;
    this.mups = hash.mups;
    this.players = this.loadPlayerHash(hash.players);
    this.startedAt = hash.startedAt;
    this.endedAt = hash.endedAt;
    return this;
  }

  loadPlayerHash(players) {
    const result = {};
    for (const [key, value] of Object.entries(players)) {
      const player = new Player().load(value)
      result[key] = player;
    }
    return result;
  }
  
  finish() {
    this.endedAt = Date.now();
  }

  addPlayer(discordUser, factionName) {
    const player = new Player().create(discordUser, factionName);
    this.players[player.user.id] = player;
  }

  getPlayer(discordUser) {
    return this.players[discordUser.id]
  }

  mup(link) {
    this.turn += 1;
    this.changePlayersToNotRolled()
    this.mups.push(new Mup(this.turn, link));
  }

  changePlayersToNotRolled() {
    for (let id of this.playerKeyList()) {
      this.players[id].rolled = false;
    }
  }

  lastMupImage() {
    if (this.mups.length) {
      return this.mups[this.mups.length - 1].image
    }
    return null
  }

  makeCurrentGameEmbed() {
    let embed = new Discord.MessageEmbed()
      .setColor('#c90040')
      .setTitle(this.name)
      .setAuthor(`Game Master: ${this.master.username}`, this.master.avatar)
      .addFields(this.makeGameFields())
      .setDescription(this.makeDescriptionOfPlayers())
    if (this.lastMupImage()) {
      embed.setImage(this.lastMupImage());
    }
    return embed;
  }

  makeGameFields() {    
    return [
        { name: `Turn`, value: this.turn, inline: true },
        { name: "Started at", value: Utils.timestampToDate(this.startedAt), inline: true }
    ]    
  }

  makeDescriptionOfPlayers() {
    if (!Object.keys(this.players).length) {
      return "No players"
    }
    let text = ""
    for (let player of this.playerHashToList()) {
      text += `\n${player.describePlayer()}`
    }
    return text;
  }

  playerHashToList() {
    return Object.values(this.players);
  }

  playerKeyList() {
    return Object.keys(this.players);
  }

}