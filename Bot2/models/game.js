const Discord = require("discord.js")
const Turn = require("./turn")

module.exports = class Game {
  constructor(_database, name, masterId, masterUsername, turnNumber = 0, startedAt = Date.now(), endedAt = null) {
    this._database = _database
    this.channel = _database ? _database.channel.id : null
    this.name = name
    this.masterId = masterId
    this.masterUsername = masterUsername
    this.turnNumber = turnNumber
    this.startedAt = startedAt
    this.endedAt = endedAt
    this._turn = _database ? _database.getTurn() || new Turn(_database) : null
  }

  loadDatabase(database) {
    this._database = database
    if (!this._turn)
      this._turn = this._database.getTurn()
  }

  nextTurn(mup, description) {
    this.turnNumber += 1
    this._turn = Turn.fromPreviousTurn(this._database, this._turn, mup, description)
    this._database.saveNewTurn(this._turn)
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