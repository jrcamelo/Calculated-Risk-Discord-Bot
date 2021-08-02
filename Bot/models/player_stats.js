module.exports = class PlayerStats {

  // Level 20 at 40000 XP
  // Average of 100 XP per roll + 100 XP per Mup = 200 Rolls
  static xpToLevel(xp) {
    return Math.floor(0.1 * Math.sqrt(xp)) + 1;
  }

  static levelToXp(level) {
    return ((level + 1)/0.1) ** 2;
  }

  static fromPlayer(player, serverId) {
    return new PlayerStats(player.id, serverId, player.username, player.avatar);
  }

  static fromObject(obj) {
    return new PlayerStats(obj.id, obj.serverId, obj.username, obj.avatar);
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
  }

  setLevelAndNextXp() {
    this.level = PlayerStats.xpToLevel(this.totalXp);
    this.nextXp = PlayerStats.levelToXp(this.level+1);
    this.neededXp = this.nextXp - this.totalXp;
  }
  
  setLuck() {
    this.luck = this.totalScore / this.games;
  }
}