const ServerTask = require('../task_server');

module.exports = class GetServerChannelGamesTask extends ServerTask {
  constructor(serverId, channel, index, perPage, filter, sort, options) {
    super(serverId, options);
    this.channel = channel;
    this.index = index;
    this.perPage = perPage;
    this.filter = filter;
    this.sort = sort;
    this.name = 'GetServerChannelGames';
  }
  
  async prepare() {
    return await this.loadGameDatabase()
  }

  async execute() {
    return await this.games.getGamesInChannel(this.channel, this.filter, this.index, this.perPage, this.sort);
  }
}