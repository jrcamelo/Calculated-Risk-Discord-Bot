const User = require("./user");
const Roll = require("./roll");

module.exports = class Player {
  static loadPlayers(hash) {
    const result = {};
    for (const [key, value] of Object.entries(hash)) {
      const player = new Player().load(value)
      result[key] = player;
    }
    return result;
  }

  create(discordUser, factionName) {
    this.user = new User().create(discordUser);
    this.name = TextUtils.sanitize(factionName);
    this.alive = true;
    this.left = false;
    this.rolled = false;
    this.rolls = [];
    return this;
  }

  load(hash) {
    const { user, name, alive, left, rolled, rolls } = hash
    this.user = new User().load(user);
    this.name = TextUtils.decode(name);
    this.alive = alive;
    this.left = left || false;
    this.rolled = rolled;
    this.rolls = this.loadRolls(rolls);
    return this;
  }

  newTurn(hash) {
    this.user = new User().loadClean(hash.user);
    this.name = hash.name;
    this.alive = hash.alive;
    this.left = false;
    this.rolled = false;
    this.rolls = [];
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
    this.name = TextUtils.encode(this.name);
    for (let i in this.rolls) {
      this.rolls[i].encode();
    }
    if (this.firstRoll) {
      this.firstRoll.encode();
    }
  }

  firstRoll() {
    if (this.rolls.length)
      return this.rolls[0]
    return null
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

  unroll() {
    this.rolls.shift();
    if (this.rolls.length == 0) {
      this.rolled = false;
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

  describePlayerMinimum(turn = null) {
    let text = ""
    if (this.alive) {
      text += `${this.describeFirstRollCompact()}`;
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

  describeFirstRollCompact() {
    if (!this.rolled || !this.rolls) {
      return `**${this.user.username}**`;
    }
    let text = this.rolls[0].describeHistoryForEmbedCompact(this);
    if (this.rolls.length > 1) {
      text += ` (and +${this.rolls.length - 1})`;
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
    if (!this.firstRoll() && !otherPlayer.firstRoll()) {
      return 0;
    }
    if (!this.firstRoll()) {
      return 1;
    }
    if (!otherPlayer.firstRoll()) {
      return -1;
    }
    if (this.firstRoll().time > otherPlayer.firstRoll().time) {
      return 1;
    }
    if (this.firstRoll().time < otherPlayer.firstRoll().time) {
      return -1;
    }
    return 0;
  }
}