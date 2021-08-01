const ServerTask = require('./task_server');

module.exports = class SaveGameOnServerTask extends ServerTask {
  constructor(serverId, options) {
    super(serverId, options);
    this.name = 'SaveGameOnServer';
  }
  
  prepare() {
  }

  execute() {
  }
}