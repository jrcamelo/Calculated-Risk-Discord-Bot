const ServerTask = require('../task_server');

module.exports = class SaveGameOnPlayerStatsTask extends ServerTask {
  constructor(serverId, playerId, win, options) {
    super(serverId, options);
    this.playerId = playerId;
    this.win = win;
    this.name = 'SaveGameOnPlayerStatsTask';
  }
  
  async prepare() {
    return await this.loadPlayerDatabase()
  }

  async execute() {
    if (this.win) {
      return await this.players.addWinToPlayer(this.playerId);
    } else {
      return await this.players.addLossToPlayer(this.playerId);
    }
  }
}