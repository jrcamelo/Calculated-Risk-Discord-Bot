const PaginatedCommand = require("../paginated_command")
const LeaderboardPresenter = require("../../presenters/leaderboard_presenter")

module.exports = class LeaderboardPlayersCommand extends PaginatedCommand {
  static aliases = ["Top", "Ranks"]
  static description = "Shows the leaderboard of players sorted by XP. Change the sorting with L, W, R."
  static argsDescription = "[L, Luck, W, Wins, R, Rolls]"
  static category = "Player"

  canDelete = true
  shouldLoop = false

  async execute() {
    this.index = 0
    this.step = 3
    this.ceiling = 30

    this.sorting = {}
    for (const arg of this.args) {
      this.addSorting(arg)
    }
    this.sorting.totalXp = -1;

    this.leaderboardPresenter = new LeaderboardPresenter(this.serverId, this.step, this.ceiling)
    const embed = await this.getReply()
    this.ceiling = (this.leaderboardPresenter.result || []).length ;
    await this.sendReply(embed)
  }

  addSorting(arg) {
    switch (arg.toUpperCase()) {
      case "L":
      case "LUCK":
        this.sorting.luck = -1
        break
      case "W":
      case "WINS":
        this.sorting.wins = -1
        break
      case "R":
      case "ROLLS":
        this.sorting.totalRolls = -1
        break
    }
  }

  async getReply() {
    return await this.leaderboardPresenter.makePlayersLeaderboardEmbed(this.index, this.sorting)
  }
}