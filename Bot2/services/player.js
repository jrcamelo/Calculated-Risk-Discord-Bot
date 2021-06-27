const User = require("./user");
const Roll = require("./roll");

module.exports = class Player {
  constructor(discordUser, factionName, id, username, avatar, name, alive = true, left = false, rolled = false) {
    this.id = discordUser ? discordUser.id : id;
    this.username = discordUser ? discordUser.username : username;
    this.avatar = discordUser ? Player.makeDiscordAvatarUrl(discordUser) : avatar;
    this.name = factionName || name || "";
    this.alive = alive != null ? alive : true;
    this.left = left != null ? left : false;
    this.rolled = rolled != null ? rolled : false;
  }
  
  static newTurn(hash) {
    return new Player(null, null, hash.id, hash.username, hash.avatar, hash.name, hash.alive)
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

  ping() {
    return `<@!${this.id}>`
  }

  describeName() {
    return `**${this.username}** ${this.getFactionParenthesis()}`
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
      return `**${this.username}**`;
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

  
  static makeDiscordAvatarUrl(discordUser) {
    const url = "https://cdn.discordapp.com/avatars/"
    return url + discordUser + "/" + discordUser.avatar + ".png";
  }
}