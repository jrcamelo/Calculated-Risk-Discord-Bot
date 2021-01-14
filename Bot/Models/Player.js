const User = require("./User");
const Roll = require("./Roll")

module.exports = class Player {
  create(discordUser, factionName) {
    this.user = new User().create(discordUser);
    this.name = factionName;
    this.alive = true;
    this.rolled = false;
    this.rolls = [];
    return this;
  }

  load(hash) {
    this.user = new User().load(hash.user);
    this.name = hash.name;
    this.alive = hash.alive;
    this.rolled = hash.rolled;
    this.rolls = hash.rolls;
    return this;
  }

  newTurn(hash) {
    this.user = new User().load(hash.user);
    this.name = hash.name;
    this.alive = hash.alive;
    this.rolled = false;
    this.rolls = [];
    return this;
  }

  // Events

  roll(message, type, arg, limit) {
    const roll = new Roll(message, type, arg, limit).roll();
    if (roll.shouldSave) {
      this.rolled = true;
      this.rolls.push(roll.describeHistory(this));
    }
    return roll;
  }

  // Descriptions

  describeJoin() {
    return `${this.user.username}${this.getFactionParenthesis()} joined the game.`;
  }
  describeDeath() {
    return `${this.user.username}${this.getFactionParenthesis()} is out of the game.`;
  }
  describeRevival() {
    return `${this.user.username}${this.getFactionParenthesis()} is back in the game.`;
  }

  describePlayerCompact(turn = null) {
    let text = ""
    if (this.alive) {
      text += `${this.describeFirstRoll()}`;
    } else {
      text += `**${this.user.username}**${this.getFactionParenthesis()} has fallen.`;
    }
    return text;
  }

  describeFirstRoll() {
    if (!this.rolled || !this.rolls) {
      return "has not rolled";
    }
    let text = this.rolls[0];
    if (this.rolls.length > 1) {
      text += ` (then +${this.rolls.length - 1})`;
    }
    return text;
  }

  describeTurnRolls() {    
    if (!this.rolled || !this.rolls) {
      return null;
    }
    for (let roll of this.rolls) {
      text += `${roll.result}`;
      if (roll.describeIntentionAndDetails()) {
        text += ` - "${roll.describeIntentionAndDetails()}"`
      }
      text += "\n";
    }
    return text;
  }

  makeHistoryText() {
    if (this.rolls.length == 0) {
      return "No rolls this turn"
    }
    let text = ""
    for (let roll of this.rolls) {
      text += roll + "\n";
    }
    return text;
  }

  // Utils

  getFactionParenthesis() {
    if (this.name) {
      return `(${this.name}) `;
    }
    return "";
  }
}