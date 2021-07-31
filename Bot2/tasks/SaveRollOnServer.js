const ServerTask = require('./task_server');

module.exports = class SaveRollOnServerTask extends ServerTask {
  constructor(serverId, options) {
    super(serverId, options);
    this.name = 'SaveRollOnServer';
  }
  
  prepare() {
  }

  execute() {
  }
}