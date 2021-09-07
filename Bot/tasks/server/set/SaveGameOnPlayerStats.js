const ServerTask = require('../task_server');

module.exports = class SaveGameOnPlayerStatsTask extends ServerTask {
  constructor(serverId, playerId, username, xp, win, options) {
    super(serverId, options);
    this.playerId = playerId;
    this.player = { id: playerId, username };

    this.xp = xp;
    this.win = win;
    this.name = 'SaveGameOnPlayerStatsTask';
  }
  
  async prepare() {
    return await this.loadPlayerDatabase()
  }

  async execute() {
    await this.getPlayerRecord()
    await this.insertPlayerIfNotExists()
    if (this.win) {
      return await this.players.addWinToPlayer(this.playerId, this.xp);
    } else {
      return await this.players.addLossToPlayer(this.playerId, this.xp);
    }
  }
}