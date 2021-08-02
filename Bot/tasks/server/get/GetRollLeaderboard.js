const ServerTask = require('../task_server');

module.exports = class GetRollLeaderboardTask extends ServerTask {
  constructor(serverId, index, limit, options) {
    super(serverId, options);
    this.index = index
    this.limit = limit
    this.name = 'GetRollLeaderboard';
  }
  
  async prepare() {
    return await this.loadRollDatabase()
  }

  async execute() {
    return await this.rolls.getRollsSortedByScore(null, null, this.index, this.limit);
  }
}