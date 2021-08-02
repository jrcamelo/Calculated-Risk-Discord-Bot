const ServerTask = require('../task_server');
const PlayerStats = require("../../../models/player_stats");

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
    if (!this.roll.ranked) return
    return await this.loadPlayerDatabase()
  }

  async execute() {
    if (!this.roll.ranked) return
    if (await !this.addRoll()) {
      const stats = new PlayerStats(this.playerId, this.serverId, this.player.username, this.player.avatar);
      await this.players.insertPlayer(stats)
      await this.addRoll()
    }
  }

  async addRoll() {
    if (this.isFirst) {
      return await this.players.addFirstRollToPlayer(this.playerId, this.roll);
    } else {
      return await this.players.addRollToPlayer(this.playerId, this.roll);
    }
  }
}