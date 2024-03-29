const Turn = require("./turn")
const SaveGameOnPlayerStats = require("../tasks/server/set/SaveGameOnPlayerStats")
const SaveGameOnServer = require("../tasks/server/set/SaveGameOnServer")
const SaveGameOnMasterStats = require("../tasks/server/set/SaveGameOnMasterStats")
const PlayerStats = require("./player_stats")

module.exports = class Game {
  constructor(_database, name, masterId, masterUsername, channel, turnNumber = 0, startedAt = Date.now(), banList = null, quitList = null, endedAt = null) {
    this._database = _database
    this.channel = channel
    this.name = name
    this.masterId = masterId
    this.masterUsername = masterUsername
    this.turnNumber = turnNumber
    this.startedAt = startedAt
    this.endedAt = endedAt
    this.uniqueId = `${channel}-${startedAt}`
    this.banList = banList || [];
    this.quitList = quitList || [];
    this._turn = _database ? _database.getTurn(this.turnNumber) || new Turn(_database) : null
  }

  loadDatabase(database) {
    this._database = database
    if (!this._turn)
      this._turn = this._database.getTurn(this.turnNumber)
  }

  updateMaster(discordUser) {
    this.masterId = discordUser.id
    this.masterUsername = discordUser.username
  }

  getTurn(number) {
    if (number == this.turnNumber || number === undefined) return this._turn
    return this._database.getTurn(number)
  }

  nextTurn(mup, description) {
    this.turnNumber += 1
    this._turn = Turn.fromPreviousTurn(this._database, this._turn, mup, description, this._turn.slots, this._turn.diplomacy, this._turn.pacts)
    this._turn.startedAt = Date.now()
    this._database.saveNewTurn(this._turn)
  }

  editTurn(mup, description) {
    if (mup) this._turn.mup = mup
    if (description) this._turn.description = description
  }

  editOldTurnAndSave(mup, description, number) {
    if (number === this.turnNumber) {
      this.editTurn(mup, description)
    } else {
      const turn = this.getTurn(number)
      if (turn) {
        turn.mup = mup
        turn.description = description
        turn.saveOld()
      }
    }
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

  renameGame(name) {
    this.name = name || "THE NAMELESS GAME"
  }

  finishGame() {
    this.endedAt = Date.now()
    this.save()
    this.saveOnServer()
    this.saveOnPlayerStats()
    this.saveOnMasterStats()
    return this._database.outdateCurrentGame(this)
  }

  saveOnServer() {
    const task = new SaveGameOnServer(this._database.getServerId(), this)
    task.addToQueue()
  }

  saveOnPlayerStats() {
    for (const player of this.getTurn().playerHashToList()) {
      let xp = this.calculateLosersXp()
      if (player.alive) xp = this.calculateWinnersXp()
      const task = new SaveGameOnPlayerStats(this._database.getServerId(), player.id, player.username, xp, player.alive)
      task.addToQueue()
    }
  }

  saveOnMasterStats() {
    const masterObj = { id: this.masterId, username: this.masterUsername }
    const masterStats = PlayerStats.fromObject(masterObj)
    const task = new SaveGameOnMasterStats(this._database.getServerId(), masterStats, this.calculateMasterXp())
    task.addToQueue()
  }

  calculateWinnersXp() {
    return this.turnNumber * 50
  }

  calculateLosersXp() {
    return this.turnNumber * 10
  }

  calculateMasterXp() {
    const playerCount = this.getTurn().playerHashToList().length
    return this.turnNumber * playerCount * 50
  }

  transferMaster(newMaster) {
    this.masterId = newMaster.id
    this.masterUsername = newMaster.username
  }

  addToBanList(playerId) {
    this.banList.push(playerId)
  }

  isPlayerBanned(playerId) {    
    return this.banList.includes(playerId)
  }

  addToQuitList(playerId) {
    this.quitList.push(playerId)
  }

  isPlayerPermaQuit(playerId) {
    return this.quitList.includes(playerId)
  }

  pingMaster() {
    return `<@!${this.masterId}>`
  }

  saveOldGameAsNew() {
    if (!this._database.isOld) return false
    this._database.saveAsNew()
    return true
  }
}