const PaginatedCommand = require("../paginated_command")
const LeaderboardPresenter = require("../../presenters/leaderboard_presenter")

module.exports = class LeaderboardRollsCommand extends PaginatedCommand {
  static aliases = ["Hall", "TopR"]
  static description = "Shows the leaderboard of rolls. You can filter for user."
  static argsDescription = "[@User]"
  static category = "Player"

  canDelete = true
  ignoreFirstArg = true
  shouldLoop = false

  async execute() {
    this.index = 0
    this.step = 3
    this.ceiling = 60

    this.leaderboardPresenter = new LeaderboardPresenter(this.serverId, this.step, this.ceiling, this.mentionedUser)
    const embed = await this.getReply()
    this.ceiling = (this.leaderboardPresenter.result || []).length ;
    await this.sendReply(embed)
  }

  async getReply() {
    return await this.leaderboardPresenter.makeRollsLeaderboardEmbed(this.index)
  }
}