module.exports = class PlayerStats {

  constructor(discordId, serverId, username, avatar, games, wins, rollCount, totalScore, xp, rank) {
    this.discordId = discordId;
    this.serverId = serverId;
    this.username = username;
    this.avatar = avatar;
    this.games = games;
    this.wins = wins;
    this.rollCount = rollCount;
    this.totalScore = totalScore;
    this.xp = xp;
    this.calculateLevelAndNextXp()
    this.rank = rank;
  }

  calculateLevelAndNextXp() {
    this.level = this.xpToLevel(this.xp);
    this.nextXp = this.levelToXp(this.level+1);
    this.neededXp = this.nextXp - this.xp;
  }

  xpToLevel(xp) {
    return Math.floor(0.05 * Math.sqrt(xp)) + 1;
  }

  levelToXp(level) {
    return ((level + 1)/0.05) ** 2;
  }
}