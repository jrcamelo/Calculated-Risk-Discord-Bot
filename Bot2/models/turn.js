const Discord = require('discord.js');
const User = require("./user");
const Player = require("./player");
const Roll = require("./roll")
const TextUtils = require("../utils/text")

module.exports = class Turn {
  constructor(database, mup = "", description = "", number = 0, players = null, rolls = null) {
    this._database = database
    this.description = description
    this.mup = mup
    this.number = number
    this._players = players || {}
    this._rolls = rolls || []
  }

  static fromPreviousTurn(database, previous, mup, description) {
    return new Turn(
      database,
      mup,
      description,
      (previous.number || 0) + 1,
      this.playersToNewTurn(previous._players),
    )
  }
  
  static playersToNewTurn(oldPlayers) {
    const newPlayers = {};
    for (let player of Object.values(oldPlayers)) {
      if (player.left != true) {
        const newPlayer = Player.newTurn(player);
        newPlayers[newPlayer.id] = newPlayer;
      }
    }
    return newPlayers;
  }

  save() {
    return this._database.saveTurn(hash)
  }

  getPlayer(discordUser) {
    return this._players[discordUser.id];    
  }

  kickPlayer(player) {
    player.alive = false;
    player.left = true;
  }

  banPlayer(player) {
    delete this.players[player.user.id]
  }

  revivePlayer(player) {
    player.alive = true
  }

  pingNotPlayed() {
    if (!Object.keys(this.players).length) {
      return "Nobody is playing yet."
    }
    let text = ""
    for (let player of this.playerHashToList()) {
      if (player.alive && !player.rolled) {
        text += `${player.ping()} `
      }
    }
    return text || "No players need to roll.";
  }

  
  playerHashToList() {
    return Object.values(this._players);
  }
}