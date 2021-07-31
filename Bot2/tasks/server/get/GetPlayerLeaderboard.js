const ServerTask = require('../../task_server');

module.exports = class GetPlayerLeaderboardTask extends ServerTask {
  constructor(serverId, options) {
    super(serverId, options);
    this.name = 'GetPlayerLeaderboard';
  }
  
  prepare() {
  }

  execute() {
  }
}