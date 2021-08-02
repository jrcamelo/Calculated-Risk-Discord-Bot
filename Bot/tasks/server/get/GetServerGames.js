const ServerTask = require('../task_server');

module.exports = class GetServerGamesTask extends ServerTask {
  constructor(serverId, options) {
    super(serverId, options);
    this.name = 'GetServerGames';
  }
  
  async prepare() {
    return await this.loadGameDatabase()
  }

  async execute() {
    return await this.games.getGamesInServer(this.serverId);
  }
}