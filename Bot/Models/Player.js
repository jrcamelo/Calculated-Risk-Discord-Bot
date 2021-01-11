const User = require("./User");
const Roll = require("./Roll")

module.exports = class Player {
  create(discordUser, factionName) {
    this.user = new User().create(discordUser);
    this.name = factionName;
    this.alive = true;
    this.allies = [];
    this.rolled = false;
    this.rolls = {};
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

  roll(turn, message, type, arg, limit) {
    const roll = new Roll(message, type, arg, limit).roll();
    if (turn != null) {
      this.rolled = true;
      if (this.rolls[turn] == null) {
        this.rolls[turn] = [];
      }
      console.log(this.rolls)
      this.rolls[turn].push(roll);
    }
    return roll;
  }

  describePlayer(turn = null) {
    let text = `**${this.user.username}**`
    if (this.name) {
      text += ` (${this.name})`
    }
    if (this.alive) {
      text += ` ${this.describeLastRoll(turn)}`;
    } else {
      text += ` is dead`;
    }
    return text;
  }

  describeLastRoll(turn) {
    const turnRolls = this.rolls[turn];
    if (turn == null || !this.rolled || !turnRolls || !turnRolls.length) {
      return "has not rolled";
    }
    let text = `rolled ${turnRolls[0].result}`;
    if (turnRolls.length > 1) {
      text += ` (then +${turnRolls.length - 1})`;
    }
    return text;
  }

  describeTurnRolls(turn) {    
    const turnRolls = this.rolls[turn];
    if (turn == null || !this.rolled || !turnRolls || !turnRolls.length) {
      return null;
    }
    let text = `${this.user.username} rolls this turn:\n`;
    for (let roll of turnRolls) {
      text += `${roll.result}`;
      if (roll.intention) {
        text += ` - "${roll.intention}"`
      }
      text += "\n";
    }
    return text;
  }
}