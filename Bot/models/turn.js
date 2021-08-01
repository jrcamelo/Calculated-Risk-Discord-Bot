const Discord = require('discord.js');
const Player = require("./player");
const Roll = require("./roll")
const TextUtils = require("../utils/text")

module.exports = class Turn {
  constructor(_database, mup = "", description = "", number = 0, players = null, rolls = null) {
    this._database = _database
    this.description = description
    this.mup = mup
    this.number = number
    this._players = players || {}
    this._rolls = rolls || []
  }

  static fromPreviousTurn(_database, previous, mup, description) {
    return new Turn(
      _database,
      mup,
      description,
      (previous.number || 0) + 1,
      this.playersToNewTurn(previous._players),
    )
  }
  
  static playersToNewTurn(oldPlayers) {
    const newPlayers = {};
    for (let player of Object.values(oldPlayers)) {
      if (player.removed != true) {
        const newPlayer = Player.newTurn(player);
        newPlayers[newPlayer.id] = newPlayer;
      }
    }
    return newPlayers;
  }

  save() {
    return this._database.saveTurn(this)
  }

  saveOld() {
    return this._database.saveTurn(this, this.number)
  }

  getPlayer(discordUser) {
    if (!discordUser) return null
    return this._players[discordUser.id];
  }

  addPlayer(discordUser, factionName) {
    this._players[discordUser.id] = new Player(discordUser, factionName)
    return this._players[discordUser.id]
  }

  renamePlayer(player, factionName) {
    player.name = factionName
  }

  kickPlayer(player) {
    player.alive = false;
    player.removed = true;
  }
  banPlayer(player) {
    delete this._players[player.id]
  }

  killPlayer(player) {
    player.alive = false
  }
  revivePlayer(player) {
    player.alive = true
  }

  addRoll(roll) {
    this._rolls.push(roll)
    this._players[roll.playerId].rolled = true
  }
  
  playerHashToList() {
    return Object.values(this._players);
  }

  rollListToPlayerHash() {
    const groupedByPlayer = {}
    for (let roll of this._rolls) {
      if (!groupedByPlayer[roll.playerId]) {
        groupedByPlayer[roll.playerId] = []
      }
      groupedByPlayer[roll.playerId].push(roll)
    }
    return groupedByPlayer
  }

  everyoneHasRolled() {
    return this.playerHashToList().every(player => player.rolled)
  }

  // TODO: Move those to Presenter

  pingNotPlayed() {
    const text = this.pingPlayers(function(player) {
      if (player.alive && !player.rolled) {
        return `${player.ping()} `
      }
    })    
    return text || "Everyone has already rolled. Mup when?";
  }

  pingAlive() {
    const text = this.pingPlayers(function(player) {
      if (player.alive) {
        return `${player.ping()} `
      }
    })    
    return text || "War leads nowhere. Everyone is dead.";
  }

  pingEveryone() {
    const text = this.pingPlayers(function(player) {
      return `${player.ping()} `
    })    
    return text;
  }

  pingPlayers(callback) {
    let text = ""
    if (!Object.keys(this._players).length) {
      return "Nobody is playing yet."
    }
    for (let player of this.playerHashToList()) {
      text += callback(player) || ""
    }
    return text
  }

  
}