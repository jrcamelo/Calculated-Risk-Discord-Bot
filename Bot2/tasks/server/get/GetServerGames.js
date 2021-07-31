const ServerTask = require('../../task_server');

module.exports = class GetServerGamesTask extends ServerTask {
  constructor(serverId, options) {
    super(serverId, options);
    this.name = 'GetServerGames';
  }
  
  prepare() {
  }

  execute() {
  }
}