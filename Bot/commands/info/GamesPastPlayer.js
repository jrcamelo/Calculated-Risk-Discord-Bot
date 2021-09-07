const GamesPastCommand = require("./GamesPast")

module.exports = class GamesPastPlayerCommand extends GamesPastCommand  {
  static aliases = ["PastPlayer"]
  static description = "Browse through old games that a user has played."
  static argsDescription = "<@User>"

  canDelete = true
  shouldLoop = true
  getsGame = false
  needsMention = true
  // hasExpand = true

  async getOldGames(_title, userId) {
    await this.presenter.getOldGamesWithPlayer(userId)
  }
}