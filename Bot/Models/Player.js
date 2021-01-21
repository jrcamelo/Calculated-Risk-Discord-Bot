const User = require("./User");
const Roll = require("./Roll");
const Utils = require("../Utils");

module.exports = class Player {
  create(discordUser, factionName) {
    this.user = new User().create(discordUser);
    this.name = Utils.sanitize(factionName);
    this.alive = true;
    this.rolled = false;
    this.rolls = [];
    this.firstRoll = null;
    return this;
  }

  load(hash) {
    this.user = new User().load(hash.user);
    this.name = Utils.decode(hash.name);
    this.alive = hash.alive;
    this.rolled = hash.rolled;
    this.rolls = this.loadRolls(hash.rolls);
    this.firstRoll = new Roll().load(hash.firstRoll);
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

  encode() {
    this.user.encode();
    this.name = Utils.encode(this.name);
    for (let i in this.rolls) {
      this.rolls[i].encode();
    }
    if (this.firstRoll) {
      this.firstRoll.encode();
    }
  }

  // Events

  roll(message, type, arg, limit) {
    const roll = new Roll(message, type, arg, limit).roll();
    if (roll.shouldSave) {
      this.rolled = true;
      if (this.firstRoll == null) {
        this.firstRoll = new Roll().load(Object.assign({}, roll));
      }
      this.rolls.push(roll);
    }
    return roll;
  }

  unroll() {
    this.rolls.shift();
    if (this.rolls.length == 0) {
      this.rolled = false;
      this.firstRoll = null;
    } else {
      this.firstRoll = new Roll().load(Object.assign({}, this.rolls[0]));
    }
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

  compareFirstRolls(otherPlayer) {
    if (!this.alive && !otherPlayer.alive) {
      return 0;
    }
    if (!this.alive) {
      return 1;
    }
    if (!otherPlayer.alive) {
      return -1;
    }
    if (!this.firstRoll && !otherPlayer.firstRoll) {
      return 0;
    }
    if (!this.firstRoll) {
      return 1;
    }
    if (!otherPlayer.firstRoll) {
      return -1;
    }
    if (this.firstRoll.time > otherPlayer.firstRoll.time) {
      return 1;
    }
    if (this.firstRoll.time < otherPlayer.firstRoll.time) {
      return -1;
    }
    return 0;
  }
}