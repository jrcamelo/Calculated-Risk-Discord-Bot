const ServerDB = require("../nedb-server")

module.exports = class ServerPlayersDatabase extends ServerDB {
  constructor(serverId) {
    super(serverId, "players.db")
  }

  async getPlayer(playerId) {
    const player = await this.db.findId(playerId)
    if (player) { return player[0] }
  }

  async getPlayers(query, sort, index=0, limit=10) {
    const sortQuery = sort || { totalXp: -1 }
    return await this.db.findSorted(query, sortQuery, index, limit)
  }

  async getPlayersSortedByWins(index=0, limit=10) {
    return await this.getPlayers({ wins: { $gt: 0 } }, { wins: 1 }, index, limit)
  }

  async getPlayerRank(playerId) {
    const player = await this.getPlayer(playerId)
    if (!player) return await 0
    return await this.getPlayerRankFromXp(player.totalXp)
  }

  async getPlayerRankFromXp(xp) {
    const rank = await this.db.count({ totalXp: { $gt: xp } })
    return rank + 1
  }

  async updatePlayer(playerId, updateQuery) {
    return await this.db.update({ id: playerId }, updateQuery)
  }

  async insertPlayer(player) {
    return await this.db.insert(player)
  }

  async upsertPlayer(player) {
    return await this.db.upsertId(player)
  }

  async updateAvatarAndUsername(playerId, avatar, username) {
    return await this.db.update({ id: playerId }, { avatar, username })
  }

  async addRollToPlayer(playerId, score, xp) {
    return await this.db.updateWithQuery({ id: playerId }, { $inc: { totalRolls: 1, totalScore: score, totalXp: xp } })
  }

  async addWinToPlayer(playerId, xp) {
    return await this.db.updateWithQuery({ id: playerId }, { $inc: { wins: 1, games: 1, totalXp: xp } })
  }

  async addLossToPlayer(playerId, xp) {
    return await this.db.updateWithQuery({ id: playerId }, { $inc: { games: 1, totalXp: xp } })
  }

  async addHostedGameToMaster(playerId, xp) {
    return await this.db.updateWithQuery({ id: playerId }, { $inc: { hostCount: 1, totalXp: xp } })
  }

  async updateLuck(playerId, luck) {
    return await this.db.update({ id: playerId }, { $set: { luck } })
  }
}