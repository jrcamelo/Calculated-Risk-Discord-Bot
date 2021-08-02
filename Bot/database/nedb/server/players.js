const ServerDB = require("../nedb-server")

module.exports = class ServerPlayersDatabase extends ServerDB {
  constructor(serverId) {
    super(serverId, "players.db")
  }

  async getPlayer(playerId) {
    const player = await this.db.findId(playerId, 1)
    if (player) { return player[0] }
  }

  async getPlayers(query, sort, index=0, limit=10) {
    const sortQuery = sort || { totalXp: -1 }
    return this.db.findSorted(query, sortQuery, index, limit)
  }

  async getPlayersSortedByWins(index=0, limit=10) {
    return this.getPlayers({ wins: { $gt: 0 } }, { wins: 1 }, index, limit)
  }

  async getPlayerRank(playerId) {
    const player = await this.getPlayer(playerId)
    if (!player) return 0
    return this.getPlayerRankFromXp(player.totalXp)
  }

  async getPlayerRankFromXp(xp) {
    const rank = await this.db.count({ totalXp: { $gt: xp } })
    return rank + 1
  }

  async updatePlayer(playerId, updateQuery) {
    return this.db.update({ id: playerId }, updateQuery)
  }

  async insertPlayer(player) {
    return this.db.insert(player)
  }

  async upsertPlayer(player) {
    return this.db.upsertId(player)
  }

  async updateAvatarAndUsername(playerId, avatar, username) {
    return this.db.update({ id: playerId }, { avatar, username })
  }

  async addFirstRollToPlayer(playerId, roll) {
    return this.db.updateWithQuery({ id: playerId }, { $inc: { totalRolls: 1, totalScore: roll.score, totalXp: roll.score + 100 } })
  }

  async addRollToPlayer(playerId, roll) {
    return this.db.updateWithQuery({ id: playerId }, { $inc: { totalRolls: 1, totalScore: roll.score } })
  }

  async addWinToPlayer(playerId) {
    return this.db.updateWithQuery({ id: playerId }, { $inc: { wins: 1, games: 1, totalXp: 1000 } })
  }

  async addLossToPlayer(playerId) {
    return this.db.updateWithQuery({ id: playerId }, { $inc: { games: 1 } })
  }
}