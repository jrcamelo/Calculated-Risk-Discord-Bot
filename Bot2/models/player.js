const Roll = require("./roll");

module.exports = class Player {
  constructor(discordUser, factionName, id, username, avatar, name, alliances, pacts, wars, alive = true, removed = false, rolled = false) {
    this.id = discordUser ? discordUser.id : id;
    this.username = discordUser ? discordUser.username : username;
    this.avatar = discordUser ? Player.makeDiscordAvatarUrl(discordUser) : avatar;
    this.name = factionName || name || "";
    this.alive = alive != null ? alive : true;
    this.alliances = alliances != null && Object.keys(alliances) ? alliances : {}
    this.pacts = pacts != null && Object.keys(pacts) ? pacts : {}
    this.wars = wars != null && Object.keys(wars) ? wars : {}
    this.removed = removed != null ? removed : false;
    this.rolled = rolled != null ? rolled : false;
  }
  
  static newTurn(hash) {
    return new Player(
      null, 
      null, 
      hash.id, 
      hash.username, 
      hash.avatar, 
      hash.name,
      hash.alliances,
      hash.pacts,
      hash.wars,
      hash.alive
    )
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