const ServerTask = require('../task_server');

module.exports = class GetPlayerStatsTask extends ServerTask {
  constructor(serverId, options) {
    super(serverId, options);
    this.name = 'GetPlayerStats';
  }
  
  prepare() {
  }

  execute() {
  }
}