const ServerTask = require('./task_server');

module.exports = class SaveRollOnPlayerStatsTask extends ServerTask {
  constructor(serverId, options) {
    super(serverId, options);
    this.name = 'SaveRollOnPlayerStats';
  }
  
  prepare() {
  }

  execute() {
  }
}