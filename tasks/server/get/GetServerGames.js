const ServerTask = require('../task_server');

module.exports = class GetServerGamesTask extends ServerTask {
  constructor(serverId, index, perPage, filter, sort, options) {
    super(serverId, options);
    this.index = index;
    this.perPage = perPage;
    this.filter = filter;
    this.sort = sort;
    this.name = 'GetServerGames';
  }
  
  async prepare() {
    return await this.loadGameDatabase()
  }

  async execute() {
    return await this.games.getGamesInServer(this.filter, null, this.index, this.perPage, this.sort);
  }
}