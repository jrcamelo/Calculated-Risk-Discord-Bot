const PaginatedCommand = require("../paginated_command.js");
const OldGamePresenter = require("../../presenters/old_game_presenter")
// const Database = require("../../database/")
// const StatusCommand = require("./Status")

module.exports = class GamesPastCommand extends PaginatedCommand  {
  static aliases = ["Past", "Old"]
  static description = "Browse through old games. Try `PastPlayer` and `PastHere` as well."
  static argsDescription = "[@Master] [Title]"

  canDelete = true
  shouldLoop = true
  getsGame = false
  // hasExpand = true

  async execute() {
    this.index = 0
    this.step = 1

    let masterId = null
    if (this.mentionedUser) {
      this.takeFirstArg()
      masterId = this.mentionedUser.id
    }
  
    this.presenter = new OldGamePresenter(this.serverId, this.step)
    await this.getOldGames(this.arg, masterId)
    this.ceiling = this.presenter.result ? this.presenter.result.length : 0
    if (!this.ceiling) {
      this.message.channel.send("No games found in this server.")
      return
    }
    await this.sendReply(await this.getReply())
  }

  async getOldGames(title, masterId) {
    await this.presenter.getOldGames(title, masterId)
  }

  async getReply() {
    return this.presenter.makeEmbed(this.index)
  }
  
  // async doExpand(_collected, command) {
  //   await command.sendGameDetails()
  //   await command.deleteReply(_collected, command)
  // }

  // async sendGameDetails() {
  //   const oldGame = this.presenter.result[this.index]
  //   if (!oldGame) return
  //   const split = oldGame.id.split("-")
  //   const channelId = split[0]
  //   const gameId = split[1]
  //   const channelObject = { id: channelId, guild: { id: this.serverId } }
  //   const database = new Database(channelObject)
  //   const game = await database.getPreviousGame(gameId)
  //   if (!game) return
  //   game.getTurn()
  // }
}