const ServerTask = require('../task_server');
const PlayerStats = require('../../../models/player_stats')

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
    await this.getPlayerRecord()
    await this.insertPlayerIfNotExists()
    if (!this.playerRecord) await this.getPlayerRecord()
    
    const oldLevel = PlayerStats.xpToLevel(this.playerRecord.totalXp)

    await this.addRoll()

    if (oldLevel !== PlayerStats.xpToLevel(this.playerRecord.totalXp)) {
      this.addLevelUpMessage()
    }

    this.updateLuck()
  }

  async addRoll() {
    let xp = this.isFirst ? 100 : 0
    xp += this.roll.score + 100
    this.playerRecord.totalScore += this.roll.score
    this.playerRecord.totalXp += xp
    this.playerRecord.totalRolls += 1
    return await this.players.addRollToPlayer(this.playerId, this.roll.score, xp);
  }

  async updateLuck() {
    const luck = this.playerRecord.totalScore / this.playerRecord.totalRolls
    return await this.players.updateLuck(this.playerId, luck)
  }

  async addLevelUpMessage() {
    
  }
}