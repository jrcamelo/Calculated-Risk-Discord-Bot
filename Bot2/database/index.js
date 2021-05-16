const storage = require("./storage.js");
const PathTo = require("./pathto.js")

class Database {
  constructor(channel) {
    this.pathTo = new PathTo(channel)
    this.gameFolderPath = this.pathTo.game()
    this.gameFilePath = this.pathTo.gameFile()
    this.currentTurnFilePath = this.pathTo.turnFile("current")
  }

  get(path) {
    if (path == null) return null
    if (!storage.exists(path)) 
      return console.debug(`GET: ${path} does not exist, returning null`)
    return storage.read(path)
  }

  set(path, content) {
    if (path == null || content == null) return null
    storage.write(path, content)
    return true
  }

  getGame() {
    return this.get(this.gameFilePath)
  }

  saveGame(game) {
    if (!storage.exists(this.gameFilePath))
      console.debug(`SAVEGAME: ${this.gameFilePath} did not exist, creating it`)
    storage.ensurePath(this.gameFolderPath)
    this.set(this.gameFilePath, game)
    return true
  }

  outdateCurrentGame(game) {
    if (!storage.exists(this.gameFilePath))
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

  getTurn(turn="current") {
    return this.get(this.pathTo.turnFile(turn))
  }

  saveTurn(turn) {
    if (!storage.exists(this.gameFilePath))
      return console.debug(`SAVETURN: ${this.gameFilePath} does not exist`)
    const newFilePath = this.pathTo.turnFile("new")
    this.set(newFilePath, turn)
    this.outdateCurrentTurn()
    storage.move(newFilePath, this.currentTurnFilePath)
    return true
  }

  outdateCurrentTurn() {
    if (storage.exists(this.currentTurnFilePath)) {
      const oldNumber = this.readTurnNumber(this.currentTurnFilePath)
      if (oldNumber == null) { // Shouldn't happen
        console.debug(`OUTDATE: ${this.currentTurnFilePath} had null turn number`)
        storage.remove(this.currentTurnFilePath)
      } else {
        storage.move(this.currentTurnFilePath, this.pathTo.turnFile(oldNumber))
      }
      return true
    }
    return false
  }

  readTurnNumber(path) {
    const turn = this.get(path)
    if (turn == null) return null
    return turn.number.toString()
  }  
}
module.exports = Database