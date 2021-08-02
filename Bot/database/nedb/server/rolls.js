const ServerDB = require("../nedb-server")

module.exports = class ServerRollsDatabase extends ServerDB {
  constructor(serverId) {
    super(serverId, "rolls.db")
  }

  async getRoll(rollId) {
    const roll = await this.db.findId(rollId, 1)
    if (roll) { return roll[0] }
  }

  async getRolls(query, sort, index=0, limit=10) {
    const sortQuery = sort || { time: -1 }
    return this.db.findSorted(query, sortQuery, index, limit)
  }

  async getRollsSortedByScore(query, sort, index=0, limit=10) {
    const sortQuery = sort || { score: -1 }
    return this.db.findSorted(query, sortQuery, index, limit)
  }

  async insertRoll(roll) {
    return this.db.insert(roll)
  }

  async upsertRoll(roll) {
    return this.db.upsertId(roll)
  }
}