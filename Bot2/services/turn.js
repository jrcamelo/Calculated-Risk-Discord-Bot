const Discord = require('discord.js');
const User = require("./user");
const Player = require("./player");
const Roll = require("./roll")
const TextUtils = require("../utils/text")

module.exports = class Turn {
  constructor(database, mup = "", description = "", number = 0, players = null, rolls = null) {
    this.database = database
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
    this.database.saveTurn(hash)
  }
}