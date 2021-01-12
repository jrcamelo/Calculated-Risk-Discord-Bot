const Discord = require('discord.js');
const User = require("./User");
const Player = require("./Player");
const Utils = require("../Utils");

module.exports = class Turn {
  
  // Constructors

  create(mup="", description="", players=null) {
    this.mup = mup;
    this.description = description;
    this.history = [];
    if (players != null) {
      this.players = this.playersFromPreviousTurn(players)
    } else {
      this.players = {};
    }
    return this;
  }

  playersFromPreviousTurn(oldPlayers) {
    let newPlayers = {};
    for (let player of Object.values(oldPlayers)) {
      let newPlayer = new Player().newTurn(player);
      newPlayers[newPlayer.user.id] = newPlayer;
    }
    return newPlayers;
  }
  
  load(hash) {
    if (hash == null) {
      return null;
    }
    this.mup = hash.mup;
    this.description = hash.description;
    this.players = this.loadPlayerHash(hash.players);
    this.history = hash.history;
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

  update(mup, description) {
    this.mup = mup || this.mup;
    this.description = description || this.description;
  }

  // Player Management
  
  addPlayer(discordUser, factionName) {
    const player = new Player().create(discordUser, factionName);
    this.players[player.user.id] = player;
  }

  getPlayer(discordUser) {
    return this.players[discordUser.id];
  }

  deletePlayer(player) {
    delete this.players[player.user.id];
  }

  doPlayerRoll(message, type, arg, limit) {
    let player = this.getPlayer(message.author);
    let roll = player.roll(message, type, arg, limit)
    if (roll.shouldSave) {
      this.history.push(roll.describeHistory(player));
    }
    return roll;
  }

  killPlayer(player) {
    player.alive = false;
    this.history.push(player.describeDeath());
  }

  revivePlayer(player) {
    player.alive = true;
    this.history.push(player.describeRevival());
  }

  // Mup Management
  
  updateMup(link, description) {
    if (!link || !Utils.isImage(link)) {
      link = this.mup;
    }
    this.mup = link;
    this.description = description || this.description;
  }

  // Descriptions

  makeHistoryText() {
    if (this.history.length == 0) {
      return "Peace. For now."
    }
    let text = ""
    for (let event of this.history) {
      text += event + "\n";
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

  // Utils
  
  playerHashToList() {
    return Object.values(this.players);
  }
}