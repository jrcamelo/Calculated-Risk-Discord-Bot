module.exports = class PlayerStats {

  // Level 20 at 40000 XP
  // Average of 100 XP per roll + 100 XP per Mup = 200 Rolls
  static xpToLevel(xp) {
    return Math.floor(0.1 * Math.sqrt(xp)) + 1;
  }

  static levelToXp(level) {
    return ((level + 1)/0.1) ** 2;
  }

  static fromPlayer(player) {
    return new PlayerStats(player.id, player.username);
  }

  static fromObject(obj) {
    return new PlayerStats(obj.id, obj.username);
  }

  constructor(id, username, games=0, wins=0, totalRolls=0, totalScore=0, totalXp=0, luck) {
    this.id = id;
    this.username = username;
    this.games = games;
    this.wins = wins;
    this.totalRolls = totalRolls;
    this.totalScore = totalScore;
    this.totalXp = totalXp;
    this.luck = luck || -1;
  }

  calculate() {
    this.setLevelAndNextXp();
    this.setLuck();
  }

  getLevel() {
    return PlayerStats.xpToLevel(this.totalXp);
  }

  setLevelAndNextXp() {
    this.level = this.getLevel()
    this.nextXp = PlayerStats.levelToXp(this.level+1);
    this.neededXp = this.nextXp - this.totalXp;
  }
  
  setLuck() {
    this.luck = this.totalScore / this.totalRolls;
  }
}