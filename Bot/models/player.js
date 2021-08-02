const PlayerStats = require("./player_stats");

module.exports = class Player {
  constructor(discordUser, factionName, id, username, avatar, name, alive, bonus, note, rolled = false, removed = false) {
    this.id = discordUser ? discordUser.id : id;
    this.username = discordUser ? discordUser.username : username;
    this.avatar = discordUser ? Player.makeDiscordAvatarUrl(discordUser) : avatar;
    this.name = factionName || name || "";
    this.alive = alive != null ? alive : true;
    this.rolled = rolled != null ? rolled : false;
    this.bonus = bonus != null ? bonus : 0
    this.note = note != null ? note : ""
    this.removed = removed != null ? removed : false;
  }
  
  static newTurn(hash) {
    return new Player(
      null, 
      null, 
      hash.id, 
      hash.username, 
      hash.avatar, 
      hash.name,
      hash.alive,
      hash.bonus,
    )
  }

  stats(serverId) {
    return PlayerStats.fromPlayer(this, serverId);
  }

  setBonus(bonus) {
    this.bonus = bonus || 0;
  }

  setNote(note) {
    this.note = note || "";
  }

  // Descriptions

  ping() {
    return `<@!${this.id}>`
  }

  pingWithFaction() {
    const faction = this.name ? ` [${this.name}]` : ""
    return `${this.ping()}${faction}`
  }

  
  static makeDiscordAvatarUrl(discordUser) {
    const url = "https://cdn.discordapp.com/avatars/"
    return url + discordUser + "/" + discordUser.avatar + ".png";
  }
}