const User = require("./User");

module.exports = class Player {
  constructor(discordUser, factionName) {
    this.__discordUser = discordUser;
    this.user = new User().create(discordUser);
    this.name = factionName;
    this.alive = true;
    this.allies = [];
    this.rolled = false;
    this.rolls = [];
  }
}