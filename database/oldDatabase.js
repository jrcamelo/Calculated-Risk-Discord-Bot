const storage = require("./storage.js");

const Database = require("./index")
const PathToOld = require("./pathtoOld")
const PathTo = require("./pathto")

module.exports = class OldDatabase extends Database{
  constructor(channelId, serverId, gameId) {
    super({ id: channelId, guild: { id: serverId } })
    this.channelId = channelId
    this.serverId = serverId
    this.gameId = gameId
    this.pathTo = new PathToOld(channelId, serverId, gameId)
    this.gameFolderPath = this.pathTo.game()
    this.gameFilePath = this.pathTo.gameFile()
  }

  set() {}
  saveTurn() {}
  saveNewTurn() {}
  outdateCurrentGame() {}
  writeGameOnPreviousGameList() {}

  saveAsNewGame() {
    const newPathTo = new PathTo({ id: this.channelId, guild: { id: this.serverId } })
    storage.move(this.pathTo.game(), newPathTo.game())
    return true
  }
}