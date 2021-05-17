const Discord = require('discord.js');
const User = require("./user");
const Player = require("./player");
const Roll = require("./roll")
const TextUtils = require("../utils/text")

module.exports = class Turn {
  constructor(database, mup = "", description = "", number = 0, players = null, rolls) {
    this.database = database
    this.description = TextUtils.sanitize(description)
    this.mup = mup
    this.number = number
    this.players = Player.loadPlayers(players || new {})
    this.rolls = Roll.loadRolls(rolls || new {})
  }

  static load(database) {
    const hash = database.getTurn()
    if (!hash) return null
    const {  mup, description, number, players } = hash
    return new Turn(
      database,
      mup,
      TextUtils.decode(description),
      number,
      players,
      rolls,
    )
  }

  static fromPreviousTurn(database, previous, mup, description) {
    return new Turn(
      database,
      mup,
      description,
      (previous.number || 0) + 1,
      this.playersToNewTurn(previous.players),
    )
  }
  
  static playersToNewTurn(oldPlayers) {
    const newPlayers = {};
    for (let player of Object.values(oldPlayers)) {
      if (player.left != true) {
        const newPlayer = Player().newTurn(player);
        newPlayers[newPlayer.user.id] = newPlayer;
      }
    }
    return newPlayers;
  }

  save() {
    const hash = {
      mup = this.mup,
      description = TextUtils.encode(description),
      number = this.number,
      players = this.playersToHash(),
      rolls = this.rollsToHash(),
    }
    this.database.saveCurrentTurn(hash)
  }

  playersToHash() {
    const hash = {}
    for (let player of Object.values(this.players)) {
      hash[player.user.id] = player.toHash()
    };
    return hash
  }

  rollsToHash() {
    return this.rolls.map(roll => roll.toHash())
  }
}