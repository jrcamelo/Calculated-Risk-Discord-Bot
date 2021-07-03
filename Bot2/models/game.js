const Discord = require("discord.js")
const Turn = require("./turn")

module.exports = class Game {
  constructor(_database, name, master, turnNumber = 0, startedAt = Date.now(), endedAt = null) {
    this._database = _database
    this.channel = _database ? _database.channel.id : null
    this.name = name
    this.master = master
    this.turnNumber = turnNumber
    this.startedAt = startedAt
    this.endedAt = endedAt
    this._turn = _database.getTurn() || new Turn(_database)
    this._turn._players[this.master.id] = this.master
  }

  nextTurn(mup, description) {
    this.turnNumber += 1
    this._turn = Turn.fromPreviousTurn(this._database, this.turn, mup, description)
    this._database.saveNewTurn(this.turn)
  }

  editTurn(mup, description) {
    if (mup) this._turn.mup = mup
    if (description) this._turn.description = description
  }

  save() {
    if (this._turn.save())
      return this._database.saveGame(this)
  }

  finishGame() {
    return this._database.outdateCurrentGame(this)
  }

  transferMaster(newMaster) {
    this.master = newMaster
  }
}