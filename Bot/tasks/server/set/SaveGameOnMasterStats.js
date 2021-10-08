const ServerTask = require('../task_server');

module.exports = class SaveGameOnMasterStats extends ServerTask {
  constructor(serverId, player, xp, options) {
    super(serverId, options);
    this.player = player;
    this.playerId = player.id;
    this.xp = xp;
    this.name = 'SaveGameOnMasterStatsTask';
  }
  
  async prepare() {
    return await this.loadPlayerDatabase()
  }

  async execute() {
    await this.getPlayerRecord()
    await this.insertPlayerIfNotExists()
    await this.players.addHostedGameToMaster(this.playerId, this.xp)
  }
}