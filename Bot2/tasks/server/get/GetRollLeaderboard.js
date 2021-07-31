const ServerTask = require('../../task_server');

module.exports = class GetRollLeaderboardTask extends ServerTask {
  constructor(serverId, options) {
    super(serverId, options);
    this.name = 'GetRollLeaderboard';
  }
  
  prepare() {
  }

  execute() {
  }
}