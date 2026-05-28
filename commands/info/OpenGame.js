const BaseCommand = require("../base_command")
const OldStatusCommand = require("./OldStatus")
const ChannelStatusCommand = require("./ChannelStatus")

module.exports = class OpenGameCommand extends BaseCommand {
  static aliases = ["GameId"]
  static description = "Open the status of a current or previous game using its ids."
  static argsDescription = "<ChannelId> [GameId]"
  static category = "Game"

  getsGame = false
  canDelete = true
  neededArgsAmount = 1

  async execute() {
    const channelId = this.args[0]
    const gameId = this.args[1]

    if (!this.isSnowflake(channelId)) {
      return this.replyDeletable(`Try again with ${this.constructor.argsDescription}`)
    }

    if (gameId && !this.isNumericId(gameId)) {
      return this.replyDeletable(`Try again with ${this.constructor.argsDescription}`)
    }

    if (gameId) {
      const oldStatus = new OldStatusCommand(this.message, channelId, this.serverId, gameId)
      await oldStatus.prepare()
      if (!oldStatus.game) {
        return this.replyDeletable("No previous game was found with those ids.")
      }
      return await oldStatus.tryExecute()
    }

    const status = new ChannelStatusCommand(this.message, channelId, this.serverId)
    await status.prepare()
    return await status.tryExecute()
  }

  isSnowflake(value) {
    return /^\d{17,20}$/.test(value)
  }

  isNumericId(value) {
    return /^\d+$/.test(value)
  }
}
