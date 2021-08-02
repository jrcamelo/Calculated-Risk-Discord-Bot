const ServerTask = require('../task_server');

module.exports = class SaveRollOnPlayerStatsTask extends ServerTask {
  constructor(serverId, player, roll, isFirst, options) {
    super(serverId, options);
    this.playerId = player.id;
    this.player = player
    this.roll = roll;
    this.isFirst = isFirst;
    this.name = 'SaveRollOnPlayerStats';
  }
  
  async prepare() {
    return await this.loadPlayerDatabase()
  }

  async execute() {
    this.getPlayerRecord()
    this.insertPlayerIfNotExists()
    
    await this.addRoll()
  }

  async addRoll() {
    if (this.isFirst) {
      return await this.players.addFirstRollToPlayer(this.playerId, this.roll);
    } else {
      return await this.players.addRollToPlayer(this.playerId, this.roll);
    }
  }
}