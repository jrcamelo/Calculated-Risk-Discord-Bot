const storage = require("./storage.js");
const PathTo = require("./pathto.js")

const Game = require("../models/game")
const Turn = require("../models/turn")
const Player = require("../models/player")
const Roll = require("../models/roll")

class Database {
  constructor(channel) {
    this.channel = channel
    this.pathTo = new PathTo(channel)
    this.gameFolderPath = this.pathTo.game()
    this.gameFilePath = this.pathTo.gameFile()
    this.currentTurnFolderPath = this.pathTo.turnFolder("current")
    this.currentTurnFilePath = this.pathTo.turnFile("current")
    this.currentPlayersFilePath = this.pathTo.playersFile("current")
    this.currentRollsFilePath = this.pathTo.rollsFile("current")
  }

  get(path, cls, hash) {
    if (path == null) return null
    if (!storage.exists(path)) 
      return console.debug(`GET: ${path} does not exist, returning null`)
    if (hash)
      return storage.readHash(path, cls)
    else
      return storage.read(path, cls)
  }

  getHash(path, cls) {
    return this.get(path, cls, true)
  }

  set(path, content, cls) {
    if (path == null || content == null) return null
    storage.write(path, content, cls)
    return true
  }

  getGame() {
    const game = this.get(this.gameFilePath, Game)
    if (game) game.loadDatabase(this)
    return game
  }

  saveGame(game) {
    if (!storage.exists(this.gameFilePath))
      console.debug(`SAVEGAME: ${this.gameFilePath} did not exist, creating it`)
    storage.ensurePath(this.gameFolderPath)
    this.set(this.gameFilePath, game, Game)
    return true
  }

  outdateCurrentGame(game) {
    if (!storage.exists(this.gameFolderPath))
      return console.debug(`OUTDATEGAME: ${this.gameFilePath} did not exist`)
    storage.ensurePath(this.pathTo.previousGames())
    this.writeGameOnPreviousGameList(game)
    const newFolderPath = this.pathTo.previousGame(game.startedAt)
    storage.ensurePath(newFolderPath)
    storage.move(this.gameFolderPath, newFolderPath)
    return true
  }

  writeGameOnPreviousGameList(game) {
    const previousGames = storage.read(this.pathTo.previousGameListFile()) || {}
    previousGames[game.startedAt] = {
      title: game.title,
      startedAt: game.startedAt,
      endedAt: game.endedAt,
      master: game.master,
      currentTurn: game.currentTurn
    }
    storage.write(this.pathTo.previousGameListFile(), previousGames)
    return true
  }

  getTurn(turnNumber="current") {
    const turn = this.get(this.pathTo.turnFile(turnNumber), Turn)
    if (!turn) return
    turn._database = this
    turn._players = this.getHash(this.pathTo.playersFile(turnNumber), Player)
    turn._rolls = this.get(this.pathTo.rollsFile(turnNumber), Roll)
    return turn
  }

  saveTurn(turn, identifier = "current") {
    storage.ensurePath(this.gameFolderPath)
    storage.ensurePath(this.pathTo.turnFolder(identifier))
    this.set(this.pathTo.turnFile(identifier), turn, Turn)
    this.set(this.pathTo.playersFile(identifier), turn._players)
    this.set(this.pathTo.rollsFile(identifier), turn._rolls)
    return true
  }

  saveNewTurn(turn) {
    if (!storage.exists(this.gameFilePath))
      return console.debug(`SAVETURN: ${this.gameFilePath} does not exist`)
    this.saveTurn(turn, "new")
    try {
      this.outdateCurrentTurn()
    } finally {
      storage.move(this.pathTo.turnFolder("new"), this.currentTurnFolderPath)
    }
    return true
  }

  outdateCurrentTurn() {
    if (storage.exists(this.currentTurnFolderPath)) {
      const oldNumber = this.readCurrentTurnNumber()
      if (oldNumber == null) { // Shouldn't happen
        console.debug(`OUTDATE: ${this.currentTurnFilePath} had null turn number`)
        storage.remove(this.currentTurnFolderPath)
      } else {
        storage.move(this.currentTurnFolderPath, this.pathTo.turnFolder(oldNumber))
      }
      return true
    }
    return false
  }

  readCurrentTurnNumber() {
    const turn = this.get(this.currentTurnFilePath, Turn)
    if (turn == null) return null
    return turn.number.toString()
  }  
}
module.exports = Database