const Discord = require("discord.js")
const Turn = require("./turn")

module.exports = class Game {
  constructor(database, name, master, turnNumber = 0, startedAt = Date.now(), endedAt = null) {
    this._database = database
    this.channel = database.channel
    this.name = name
    this.master = master
    this.turnNumber = turnNumber
    this.startedAt = startedAt
    this.endedAt = endedAt
    this._turn = database.getTurn() || new Turn(database)
  }

  nextTurn(mup, description) {
    this.turnNumber += 1
    this._turn = Turn.fromPreviousTurn(database, this.turn, mup, description)
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