module.exports = class PlayerStats {

  // Level 20 at 160000 XP
  // Average of 100 XP per roll + 100 XP per Mup = 800 Rolls
  static xpToLevel(xp) {
    return Math.floor(0.05 * Math.sqrt(xp));
  }

  static levelToXp(level) {
    return ((level)/0.05) ** 2;
  }

  static fromPlayer(player) {
    return new PlayerStats(player.id, player.username);
  }

  static fromObject(obj) {
    return new PlayerStats(obj.id, obj.username);
  }

  static fromDb(stats) {
    return new PlayerStats(
      stats.id, 
      stats.username, 
      stats.games, 
      stats.wins, 
      stats.totalRolls, 
      stats.totalScore, 
      stats.totalXp, 
      stats.luck, 
      stats.hostCount
    ).calculate();
  }

  constructor(id, username, games=0, wins=0, totalRolls=0, totalScore=0, totalXp=0, luck=-1, hostCount=0) {
    this.id = id;
    this.username = username;
    this.games = games;
    this.wins = wins;
    this.totalRolls = totalRolls;
    this.totalScore = totalScore;
    this.totalXp = totalXp;
    this.luck = luck;
    this.hostCount = hostCount;
  }

  calculate() {
    this.setLevelAndNextXp();
    this.setLuck();
    return this;
  }

  getLevel() {
    return PlayerStats.xpToLevel(this.totalXp);
  }

  setLevelAndNextXp() {
    this.level = this.getLevel()
    this.nextLevelXp = PlayerStats.levelToXp(this.level+1) - PlayerStats.levelToXp(this.level)
    this.currentXp = this.totalXp - PlayerStats.levelToXp(this.level);
  }
  
  setLuck() {
    this.luck = this.totalScore / this.totalRolls;
  }
}