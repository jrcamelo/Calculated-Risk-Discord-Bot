const GamesPastCommand = require("./GamesPast")

module.exports = class GamesPastHereCommand extends GamesPastCommand  {
  static aliases = ["PastHere"]
  static description = "Browse through old games in this channel."
  static argsDescription = "[@Master] [Title]"

  canDelete = true
  shouldLoop = true
  getsGame = false
  // hasExpand = true

  async getOldGames(title, masterId) {
    await this.presenter.getOldGamesInChannel(title, masterId, this.channel.id)
  }
}