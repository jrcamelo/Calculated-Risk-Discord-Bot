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
    this.mups = [new Mup(0, "", "")];
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

  deletePlayer(player) {
    delete this.players[player.user.id]
  }

  mup(description, link) {
    this.turn += 1;
    this.changePlayersToNotRolled()
    this.updateMup(description, link);
  }

  updateMup(description, link) {
    if (!link || !Utils.isImage(link)) {
      link = "";
    }
    this.mups.push(new Mup(this.turn, description, link));
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

  getMup(turn) {
    if (turn < this.mups.length) {
      return this.mups[turn];
    }
    return 
  }

  getMupImage(turn) {
    let mup = this.getMup(turn);
    if (mup) {
      return mup.image;
    }
    return "";
  }

  makeCurrentGameEmbed(index, showMupDescription=false) {
    if (index == null) {
      index = this.turn;
    }
    let embed = new Discord.MessageEmbed()
      .setColor('#c90040')
      .setTitle(this.name)
      .setAuthor(`Game Master: ${this.master.username}`, this.master.avatar)
      .addFields(this.makeGameFields(index))
      .setDescription(this.makeDescription(index, showMupDescription))
      .setThumbnail(this.getMupImage(index));    
    return embed;
  }

  makeDescription(index, showMupDescription) {
    let text = "";
    if (showMupDescription) {
      text += `${this.getMup(index).description}\n\n`
    }
    text += `${this.makeDescriptionOfPlayers(index)}`
    return text;
  }

  makeGameFields(index) {    
    return [
        { name: `Turn`, value: index, inline: true },
        { name: "Started at", value: Utils.timestampToDate(this.startedAt), inline: true }
    ]    
  }

  makeDescriptionOfPlayers(turn) {
    if (!Object.keys(this.players).length) {
      return "No players."
    }
    let text = ""
    for (let player of this.playerHashToList()) {
      text += `\n${player.describePlayer(turn)}`
    }
    return text;
  }

  pingNotPlayed() {
    if (!Object.keys(this.players).length) {
      return "Nobody is playing yet."
    }
    let text = ""
    for (let player of this.playerHashToList()) {
      if (player.alive && !player.rolled) {
        text += `${player.user.ping()} `
      }
    }
    return text || "No players need to roll.";
  }

  playerHashToList() {
    return Object.values(this.players);
  }

  playerKeyList() {
    return Object.keys(this.players);
  }

}