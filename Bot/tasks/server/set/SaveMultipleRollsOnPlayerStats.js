const ServerTask = require('../task_server');
const PlayerStats = require('../../../models/player_stats')
const Emotes = require('../../../utils/emotes')

module.exports = class SaveMultipleRollsOnPlayerStatsTask extends ServerTask {
  constructor(serverId, message, player, multipleRolls, isFirst, options) {
    super(serverId, options);
    this.message = message;
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
    await this.getPlayerRecord()
    await this.insertPlayerIfNotExists()
    if (!this.playerRecord) await this.getPlayerRecord()
    
    const oldLevel = PlayerStats.xpToLevel(this.playerRecord.totalXp)

    for (let roll of this.multipleRolls) {
      await this.addRoll(roll)
      this.isFirst = false
    }

    if (oldLevel !== PlayerStats.xpToLevel(this.playerRecord.totalXp)) {
      this.addLevelUpReact()
    }

    await this.updateLuck()
  }

  async addRoll(roll) {
    let xp = this.isFirst ? 100 : 0
    xp += roll.score + 100
    this.playerRecord.totalScore += roll.score
    this.playerRecord.totalXp += xp
    this.playerRecord.totalRolls += 1
    return await this.players.addRollToPlayer(this.playerId, roll.score, xp);
  }

  async updateLuck() {
    const luck = this.playerRecord.totalScore / this.playerRecord.totalRolls
    return await this.players.updateLuck(this.playerId, luck)
  }

  async addLevelUpReact() {
    if (this.message) this.message.react(Emotes.levelUp)
  }
}