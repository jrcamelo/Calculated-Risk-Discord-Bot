const Utils = require("../utils/rolls")
const { makeMessageLink } = require("../utils/discord");

module.exports = class Roll {
  static DEFAULT_MAX = 100000000000;

  constructor(message, intention, limit=null, messageId=null, messageLink=null, playerId=null, time=Date.now(), value=null, size=null, specialValue=null, formattedValue=null) {
    this.messageId = message ? message.id : messageId
    this.messageLink = message ? makeMessageLink(message) : messageLink
    this.playerId = message ? message.author.id : playerId
    this.intention = intention
    this.limit = limit
    this.time = time
    this.value = value
    this.size = size
    this.specialValue = specialValue
    this.formattedValue = formattedValue
  }

  doRollWithID() {
    this.value = this.messageId
    this.calculateRoll()
  }

  doRollWithLimit() {
    this.value = Utils.randomNumber(0, this.limit || Roll.DEFAULT_MAX)
    this.calculateRoll()
  }
  
  calculateRoll() {
    let str = this.value.toString();
    this.repeated = Utils.findRepeatedSize(str);
    this.pali = Utils.findPalindromeSize(str);
    this.straight = Utils.findStraightSize(str);
    this.funny = Utils.findFunnyNumberSize(str);
    this.size = Math.max(1, this.repeated, this.pali, this.straight, this.funny);
    this.specialValue = str.slice(-this.size)
    this.formattedValue = Utils.spliceFromEnd(str, this.size, "**") + "**";
  }

  valueOf() {
    return this.time;
  };
}