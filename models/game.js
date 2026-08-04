const Turn = require("./turn")
const SaveGameOnPlayerStats = require("../tasks/server/set/SaveGameOnPlayerStats")
const SaveGameOnServer = require("../tasks/server/set/SaveGameOnServer")
const SaveGameOnMasterStats = require("../tasks/server/set/SaveGameOnMasterStats")
const PlayerStats = require("./player_stats")

module.exports = class Game {
  constructor(_database, name, masterId, masterUsername, channel, turnNumber = 0, startedAt = Date.now(), banList = null, quitList = null, endedAt = null, closed = null, keepSlotsOnMup = null, maxAllies = -1, maxNAPs = -1) {
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
    this.closed = closed || false;
    this.keepSlotsOnMup = keepSlotsOnMup || false;
    this.maxAllies = maxAllies;
    this.maxNAPs = maxNAPs;
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
    let oldFactionSlots = this._turn.factionSlots;
    this.turnNumber += 1
    this._turn = Turn.fromPreviousTurn(this._database, this._turn, mup, description, this._turn.slots, this._turn.diplomacy, this._turn.pacts, this._turn.lurkers)
    this._turn.startedAt = Date.now()

    if (this.keepSlotsOnMup == true) {
      this._turn.factionSlots = oldFactionSlots
    }
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
    if (!this.endedAt) {
      this.saveOnPlayerStats()
      this.saveOnMasterStats()
    }
    this.endedAt = Date.now()
    this.save()
    this.saveOnServer()
    return this._database.outdateCurrentGame(this)
  }

  toggleClosedClaims() {
    if (this.closed == null) {
      this.closed = true
    } else {
      this.closed = !this.closed
    }
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

  unbanPlayer(playerId) {
    const i = this.banList.indexOf(playerId)
    if (i !== -1) this.banList.splice(i, 1)
  }

  addToQuitList(playerId) {
    this.quitList.push(playerId)
  }

  isPlayerPermaQuit(playerId) {
    return this.quitList.includes(playerId)
  }

  unquitPlayer(playerId) {
    const i = this.quitList.indexOf(playerId)
    if (i !== -1) this.quitList.splice(i, 1)
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
