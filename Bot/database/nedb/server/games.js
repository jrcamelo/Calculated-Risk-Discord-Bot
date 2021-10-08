const ServerDB = require("../nedb-server")

module.exports = class ServerGamesDatabase extends ServerDB {
  constructor(serverId) {
    super(serverId, "games.db")
  }

  async getGamesInServer(query={}, extraQuery={}, index=0, perPage=1, sort) {
    const sortQuery = sort || { startedAt: -1 }
    return await this.db.findSorted({ ...query, ...extraQuery } , sortQuery, index, perPage)
  }

  async getGamesInChannel(channelId, extraQuery={}, index=0, perPage=1, sort) {
    return await this.getGamesInServer(
      { channel: channelId }, 
      extraQuery, 
      index,
      perPage,
      sort,
    )
  }

  async getFinishedGames(index=0, perPage=1, sort) {
    return await this.getGamesInServer({ finishedAt: { $ne: null } }, {}, index, perPage, sort)
  }

  async getFinishedGamesInChannel(channelId, index=0, perPage=1, sort) {
    return await this.getGamesInChannel(channelId, index, perPage, sort, { finishedAt: { $ne: null } })
  }

  async getGamesWithPlayer(playerId, index=0, perPage=1, sort, query) {
    const playerQuery = `players.${playerId}`
    return await this.getGamesInServer(
      { [playerQuery]: { $exists: true } }, 
      query, 
      index, 
      perPage,
      sort, 
    )
  }

  async getFinishedGamesWithPlayer(playerId, index=0, perPage=1, sort) {
    return await this.getGamesWithPlayer(playerId, index, perPage, sort, { finishedAt: { $ne: null } })
  }

  async getGameWithId(gameId) {
    const game = await this.db.findId(gameId, 1)
    if (game) { return game[0] }
  }

  async countGamesInServer() {
    return await this.db.count()
  }

  async countGamesWithPlayer(playerId) {
    const playerQuery = `players.${playerId}`
    return await this.db.count({ [playerQuery]: { $exists: true } })
  }

  async upsertGame(game) {
    return await this.db.upsertId(game)
  }
}