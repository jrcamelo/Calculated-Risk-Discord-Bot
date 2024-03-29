const PlayerStats = require("./player_stats");

module.exports = class Player {
  constructor(discordUser, factionName, id, username, avatar, name, alive, allies, naps, bonus, note, rolled = false, rollTime = null, removed = false) {
    this.id = discordUser ? discordUser.id : id;
    this.username = discordUser ? discordUser.username : username;
    this.avatar = discordUser ? Player.makeDiscordAvatarUrl(discordUser) : avatar;
    this.name = factionName || name || "";
    this.alive = alive != null ? alive : true;
    this.allies = allies || {};
    this.naps = naps || {};
    this.rolled = rolled != null ? rolled : false;
    this.rollTime = rollTime != null ? rollTime : null;
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
      hash.allies,
      hash.naps,
      hash.bonus,
    )
  }

  update(discordUser) {
    this.username = discordUser ? discordUser.username : this.username;
    this.avatar = discordUser ? Player.makeDiscordAvatarUrl(discordUser) : this.avatar;
  }

  stats() {
    return PlayerStats.fromPlayer(this);
  }

  setBonus(bonus) {
    this.bonus = bonus || 0;
  }

  setNote(note) {
    this.note = note || "";
  }

  allyWith(player) {
    this.allies[player.id] = true;
  }

  isAlly(player) {
    const id = player.id || player;  
    return this.allies[id] || false;
  }

  betray(player) {
    if (this.isAlly(player)) {
      delete this.allies[player.id];
    }
  }

  getAllies() {
    return Object.keys(this.allies)
  }

  napWith(player) {
    this.naps[player.id] = true;
  }

  isNAP(player) {
    const id = player.id || player;  
    return this.naps[id] || false;
  }

  break(player) {
    if (this.isNAP(player)) {
      delete this.naps[player.id];
    }
  }

  getNAPs() {
    return Object.keys(this.naps);
  }

  // Descriptions

  ping() {
    return `<@!${this.id}>`
  }

  pingWithFaction() {
    const faction = this.name ? ` [${this.name}]` : ""
    return `${this.ping()}${faction}`
  }

  usernameWithFaction() {
    const faction = this.name ? ` [${this.name}]` : ""
    return `**${this.username}**${faction}`
  }

  usernameWithFactionNotBold() {
    const faction = this.name ? ` [${this.name}]` : ""
    return `${this.username}${faction}`
  }

  compareToOtherPlayer(otherPlayer) {
    if (!this.alive && !otherPlayer.alive) {
      return 0;
    }
    if (!this.alive) {
      return 1;
    }
    if (!otherPlayer.alive) {
      return -1;
    }
    if (!this.rolled && !otherPlayer.rolled) {
      return 0;
    }
    if (!this.rolled) {
      return 1;
    }
    if (!otherPlayer.rolled) {
      return -1;
    }
    if (this.rollTime < otherPlayer.rollTime) {
      return -1;
    }
    if (this.rollTime > otherPlayer.rollTime) {
      return 1;
    }
    return 0;
  }

  
  static makeDiscordAvatarUrl(discordUser) {
    const url = "https://cdn.discordapp.com/avatars/"
    return url + discordUser + "/" + discordUser.avatar + ".png";
  }
}