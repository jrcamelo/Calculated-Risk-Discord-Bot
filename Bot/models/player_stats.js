module.exports = class PlayerStats {

  static xpToLevel(xp) {
    return Math.floor(0.05 * Math.sqrt(xp)) + 1;
  }

  static levelToXp(level) {
    return ((level + 1)/0.05) ** 2;
  }

  constructor(id, serverId, username, avatar, games=0, wins=0, totalRolls=0, totalScore=0, totalXp=0) {
    this.id = id;
    this.serverId = serverId;
    this.username = username;
    this.avatar = avatar;
    this.games = games;
    this.wins = wins;
    this.totalRolls = totalRolls;
    this.totalScore = totalScore;
    this.totalXp = totalXp;
    this.calculateLevelAndNextXp()
  }

  calculateLevelAndNextXp() {
    this.level = PlayerStats.xpToLevel(this.totalXp);
    this.nextXp = PlayerStats.levelToXp(this.level+1);
    this.neededXp = this.nextXp - this.totalXp;
  }

}