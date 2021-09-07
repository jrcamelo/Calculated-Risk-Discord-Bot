const ServerTask = require('../task_server');

module.exports = class GetServerPlayerGamesTask extends ServerTask {
  constructor(serverId, playerId, index, perPage, sort, options) {
    super(serverId, options);
    this.index = index;
    this.playerId = playerId;
    this.perPage = perPage;
    this.sort = sort;
    this.name = 'GetServerPlayerGames';
  }
  
  async prepare() {
    return await this.loadGameDatabase()
  }

  async execute() {
    return await this.games.getGamesWithPlayer(this.playerId, this.index, this.perPage, this.sort);
  }
}