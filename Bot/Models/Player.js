const User = require("./User");
const Roll = require("./Roll")

module.exports = class Player {
  create(discordUser, factionName) {
    this.user = new User().create(discordUser);
    this.name = factionName;
    this.alive = true;
    this.rolled = false;
    this.rolls = [];
    this.firstRoll = null;
    return this;
  }

  load(hash) {
    this.user = new User().load(hash.user);
    this.name = hash.name;
    this.alive = hash.alive;
    this.rolled = hash.rolled;
    this.rolls = this.loadRolls(hash.rolls);
    this.firstRoll = hash.firstRoll;
    return this;
  }

  newTurn(hash) {
    this.user = new User().load(hash.user);
    this.name = hash.name;
    this.alive = hash.alive;
    this.rolled = false;
    this.rolls = [];
    this.firstRoll = null;
    return this;
  }

  loadRolls(hash) {
    let rolls = []
    for (let roll of hash) {
      rolls.push(new Roll().load(roll));
    }
    return rolls;
  }

  // Events

  roll(message, type, arg, limit) {
    const roll = new Roll(message, type, arg, limit).roll();
    if (roll.shouldSave) {
      this.rolled = true;
      this.rolls.push(roll);
    }
    return roll;
  }

  // Descriptions

  describeName() {
    return `**${this.user.username}** ${this.getFactionParenthesis()}`
  }

  describeJoin() {
    return `${this.describeName()} joined the game.`;
  }
  describeDeath() {
    return `${this.describeName()} is out of the game.`;
  }
  describeRevival() {
    return `${this.describeName()} is back in the game.`;
  }

  describePlayerCompact(turn = null) {
    let text = ""
    if (this.alive) {
      text += `${this.describeFirstRoll()}`;
    } else {
      text += `${this.describeName()} has fallen.`;
    }
    return text;
  }

  describeFirstRoll() {
    if (!this.rolled || !this.rolls) {
      return `${this.describeName()} **has not rolled.**`;
    }
    let text = this.rolls[0].describeHistoryForEmbed(this);
    if (this.rolls.length > 1) {
      text += ` (then +${this.rolls.length - 1})`;
    }
    return text;
  }

  makeHistoryText() {
    if (this.rolls.length == 0) {
      return "No rolls this turn"
    }
    let text = ""
    for (let roll of this.rolls) {
      text += roll.describeHistoryForText(this) + "\n";
    }
    return text;
  }

  // Utils

  getFactionParenthesis() {
    if (this.name) {
      return `(${this.name})`;
    }
    return "";
  }
}