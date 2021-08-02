const ServerTask = require('../task_server');

module.exports = class GetPlayerLeaderboardTask extends ServerTask {
  constructor(serverId, index, limit, options) {
    super(serverId, options);
    this.index = index;
    this.limit = limit;
    this.name = 'GetPlayerLeaderboard';
  }
  
  async prepare() {
    return await this.loadPlayerDatabase()
  }

  async execute() {
    return await this.players.getPlayers(null, null, this.index, this.limit);
  }
}