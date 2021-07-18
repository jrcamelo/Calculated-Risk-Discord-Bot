const Discord = require("discord.js")
const Turn = require("./turn")

module.exports = class Game {
  constructor(_database, name, masterId, masterUsername, channel, turnNumber = 0, startedAt = Date.now(), endedAt = null) {
    this._database = _database
    this.channel = channel
    this.name = name
    this.masterId = masterId
    this.masterUsername = masterUsername
    this.turnNumber = turnNumber
    this.startedAt = startedAt
    this.endedAt = endedAt
    this.uniqueId = `${channel}-${startedAt}`
    this._turn = _database ? _database.getTurn() || new Turn(_database) : null
  }

  loadDatabase(database) {
    this._database = database
    if (!this._turn)
      this._turn = this._database.getTurn()
  }

  getTurn(number) {
    if (number == this.turnNumber || number === undefined) return this._turn
    return this._database.getTurn(number)
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

  getAllTurns() {
    const turns = []
    for (let i = 0; i <= this.turnNumber; i++) {
      const turn = this.getTurn(i)
      if (turn) turns.push(turn)
    }
    return turns
  }

  getMups() {      
    return this.getAllTurns().map(t => t.mup)
  }

  save() {
    if (this._turn.save())
      return this._database.saveGame(this)
  }

  finishGame() {
    this.endedAt = Date.now()
    this.save()
    return this._database.outdateCurrentGame(this)
  }

  transferMaster(newMaster) {
    this.masterId = newMaster.id
    this.masterUsername = newMaster.username
  }

  // TODO: Presenter
  pingMaster() {
    return `<@!${this.masterId}>`
  }
}