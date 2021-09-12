const Database = require("./index")
const PathToOld = require("./pathtoOld")

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
}