const ServerTask = require('../task_server');

module.exports = class GetPlayerStatsTask extends ServerTask {
  constructor(serverId, playerId, options) {
    super(serverId, options);
    this.playerId = playerId;
    this.name = 'GetPlayerStats';
  }
  
  async prepare() {
    return await this.loadPlayerDatabase()
  }

  async execute() {
    return await this.players.getPlayer(this.playerId);
  }
}