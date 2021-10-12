const StatusCommand = require("./Status")
const OldDatabase = require("../../database/oldDatabase")

// Should only be used by the bot itself
module.exports = class OldStatusCommand extends StatusCommand {
  static aliases = []
  
  getsGame = false
  needsGame = false

  constructor(message, channelId, serverId, gameId) {
    super(message, [])
    this.channel = channelId
    this.serverId = serverId
    this.gameId = gameId
  }

  prepareGameData() {
    this.database = new OldDatabase(this.channel, this.serverId, this.gameId)
    this.game = this.database.getGame()
    if (this.game != null) this.turn = this.game._turn
  }
}
