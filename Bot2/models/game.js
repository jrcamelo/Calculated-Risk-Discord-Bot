const Discord = require("discord.js")
const Database = require("../database")
const Turn = require("./turn")

module.exports = class Game {
  constructor(database, name, master, turnNumber = 0, startedAt = Date.now(), endedAt = null) {
    this.database = database
    this.name = name
    this.master = master
    this.turnNumber = turnNumber
    this.startedAt = startedAt
    this.endedAt = endedAt
    this._turn = Turn.load(database)
  }

  nextTurn(mup, description) {
    this.turnNumber += 1
    this._turn = Turn.fromPreviousTurn(database, this.turn, mup, description)
    this.database.saveNewTurn(this.turn)
  }
}