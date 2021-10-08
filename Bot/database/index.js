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
  }

  getServerId() {
    return this.pathTo.serverId
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
    const newFolderPath = this.pathTo.previousGame(game.startedAt.toString())
    // storage.ensurePath(newFolderPath)
    storage.move(this.gameFolderPath, newFolderPath)
    return true
  }

  writeGameOnPreviousGameList(game) {
    const previousGames = storage.read(this.pathTo.previousGameListFile(), Object) || {}
    previousGames[game.startedAt] = {
      name: game.name,
      startedAt: game.startedAt,
      endedAt: game.endedAt,
      masterId: game.masterId,
      masterUsername: game.masterUsername
    }
    storage.write(this.pathTo.previousGameListFile(), previousGames)
    return true
  }

  getTurn(turnNumber) {
    const turn = this.get(this.pathTo.turnFile(turnNumber), Turn)
    if (!turn) return
    turn._database = this
    turn._players = this.getHash(this.pathTo.playersFile(turnNumber), Player)
    turn._rolls = this.get(this.pathTo.rollsFile(turnNumber), Roll)
    return turn
  }

  saveTurn(turn, identifier) {
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
    try {
      this.saveTurn(turn, turn.number)
    } catch (e) {
      console.log("SAVETURN: ERROR - Could not save new turn")
      console.error(e)
      if (storage.exists(this.pathTo.turnFolder(turn.number))) {
        storage.delete(this.pathTo.turnFolder(turn.number))
        console.debug(`SAVETURN: ${this.pathTo.turnFolder(turn.number)} was deleted`)
      }
      return false
    }
    return true
  }

  getPreviousGame(gameId) {
    const game = this.get(this.pathTo.previousGameFile(gameId), Game)
    if (game) game.loadDatabase(this)
    return game
  }
}
module.exports = Database