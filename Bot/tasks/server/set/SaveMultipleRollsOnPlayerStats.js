const ServerTask = require('../task_server');

module.exports = class SaveMultipleRollsOnPlayerStatsTask extends ServerTask {
  constructor(serverId, player, multipleRolls, isFirst, options) {
    super(serverId, options);
    this.playerId = player.id;
    this.player = player
    this.multipleRolls = multipleRolls;
    this.isFirst = isFirst;
    this.name = 'SaveMultipleRollsOnPlayerStats';
  }
  
  async prepare() {
    return await this.loadPlayerDatabase()
  }

  async execute() {
    this.getPlayerRecord()
    this.insertPlayerIfNotExists()
    
    for (let roll of this.multipleRolls) {
      await this.addRoll(roll)
      this.isFirst = false
    }
  }

  async addRoll(roll) {
    if (this.isFirst) {
      return await this.players.addFirstRollToPlayer(this.playerId, roll);
    } else {
      return await this.players.addRollToPlayer(this.playerId, roll);
    }
  }
}