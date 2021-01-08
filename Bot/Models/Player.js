const User = require("./User");
const Roll = require("./Roll")

module.exports = class Player {
  create(discordUser, factionName) {
    this.user = new User().create(discordUser);
    this.name = factionName;
    this.alive = true;
    this.allies = [];
    this.rolled = false;
    this.rolls = [];
    return this;
  }

  load(hash) {
    this.user = new User().load(hash.user);
    this.name = hash.name;
    this.alive = hash.alive;
    this.allies = hash.allies;
    this.rolled = hash.rolled;
    this.rolls = hash.rolls;
    return this;
  }

  roll(message, type, arg, limit) {
    const roll = new Roll(message, type, arg, limit).roll();
    this.rolled = true;
    this.rolls.unshift(roll);
    return roll;
  }

  describePlayer() {
    let text = `**${this.user.username}**`
    if (this.name) {
      text += ` (${this.name})`
    }
    text += ` ${this.describeLastRoll()}`;
    return text;
  }

  describeLastRoll() {
    if (!this.rolled || !this.rolls.length) {
      return "has not rolled";
    }
    const roll = this.rolls[0];
    return `rolled ${roll.result}`;
  }
}