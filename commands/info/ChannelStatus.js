const StatusCommand = require("./Status")
const Database = require("../../database")

// Should only be used by the bot itself
module.exports = class ChannelStatusCommand extends StatusCommand {
  static aliases = []

  getsGame = false

  constructor(message, channelId, serverId) {
    super(message, [])
    this.channel = { id: channelId, guild: { id: serverId } }
    this.serverId = serverId
  }

  prepareGameData() {
    this.database = new Database(this.channel)
    this.game = this.database.getGame()
    if (this.game != null) this.turn = this.game._turn
  }
}
