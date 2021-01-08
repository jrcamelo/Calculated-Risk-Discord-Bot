const Discord = require('discord.js');
const Utils = require("../Utils");

module.exports = class Roll {
  DEFAULT_MAX = 1000000000000
  DATABASE_MAX = 10000000000000000

  constructor(message, type, arg, limit) {
    this.__message = message;
    this.type = type
    this.intention = arg;
    if (!limit || limit < 1 || limit > this.DATABASE_MAX) {
      this.userLimit = this.DEFAULT_MAX;
    } else {
      this.userLimit = limit;
    }
    this.time = Date.now()
    return this;
  }

  load(hash) {
    this.value = hash.value;
    this.type = hash.type;
    this.intention = hash.intention || "";
    this.userLimit = this.userLimit;
    this.result = hash.result;
    this.time = hash.time;
    return this;
  }

  static types = {
    NORMAL: "NORMAL",
    ID: "ID",
    TEST: "TEST",
    TESTID: "TESTID",
  }

  roll() {
    switch(this.type) {
      case Roll.types.NORMAL:
      case Roll.types.TEST:
        this.rollNormal();
        break;
      case Roll.types.ID:
      case Roll.types.TESTID:
        this.rollId();
        break;
      default:
        return null;
    }
    return this;
  }

  rollNormal() {
    this.value = this.randomNumber(1, this.userLimit);
    this.result = this.calculateRoll();
    return this;
  }

  rollId() {
    this.value = this.__message.id;
    this.result = this.calculateRoll();
    return this;
  }

  calculateRoll() {
    let rollString = this.value.toString()
    return Utils.spliceFromEnd(rollString, 3, "**") + "**"
  }


  makeText(player) {    
    let text = `${this.describeRoll(player)}\n`;
    text += this.describeIntentionAndDetails();
    return text;
  }

  makeEmbed(player) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`${this.describeRoll(player)}`)
      .setDescription(this.describeIntentionAndDetails())
    return embed;
  }
  
  describeRoll(player) {
    return `${player.user.ping()} ${this.describeType()}${this.describeRollValue()}`;
  }

  describeType() {
    switch(this.type) {
      case Roll.types.NORMAL:
        return `rolled `
      case Roll.types.ID:
        return `rolled ID `
      case Roll.types.TEST:
        return `test rolled `
      case Roll.types.TESTID:
        return `test rolled ID `
      default:
        return "rolled ";
    }
  }

  describeRollValue() {
    return `${this.result}`
  }

  describeIntentionAndDetails() {
    let intention = "";
    if (this.intention) {
      intention = `**${this.intention}**`
    }
    let details = this.describeDetails();
    if (details && intention) {
      return `${details} - ${intention}`
    }
    return `${details}${intention}`
  }

  describeDetails() {
    switch(this.type) {
      case Roll.types.NORMAL:
        if (this.userLimit == this.DEFAULT_MAX) {
          return ""
        }
        return `Rolled for ${this.userLimit} `
      case Roll.types.ID:
      case Roll.types.TEST:
      case Roll.types.TESTID:
      default:
        return "";
    }
  }


  randomNumber(min=1, max=1000000000000) {
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
  }
}