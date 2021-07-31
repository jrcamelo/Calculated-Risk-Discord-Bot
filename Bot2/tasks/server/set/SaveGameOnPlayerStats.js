const ServerTask = require('../../task_server');

module.exports = class SaveGameOnPlayerStatsTask extends ServerTask {
  constructor(serverId, options) {
    super(serverId, options);
    this.name = 'SaveGameOnPlayerStatsTask';
  }
  
  prepare() {
  }

  execute() {
  }
}