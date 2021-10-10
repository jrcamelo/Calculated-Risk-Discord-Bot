const RollStats = require("./roll_stats")
const Utils = require("../utils/rolls")
const { makeMessageLink } = require("../utils/discord");

module.exports = class Roll {
  static DEFAULT_MAX = 100000000000;

  constructor(message, intention, gameTime, turnNumber, limit=null, test=false, ranked=true, multiple=0, messageId=null, messageLink=null, playerId=null, channelId=null, time=Date.now(), value=null, size=null, specialValue=null, formattedValue=null, id=null) {
    this.messageId = message ? message.id : messageId
    this.messageLink = message ? makeMessageLink(message) : messageLink
    this.playerId = playerId ? playerId : (message ? message.author.id : null)
    this.channelId = channelId ? channelId : (message ? message.channel.id : null)
    this.gameTime = gameTime
    this.turnNumber = turnNumber
    this.intention = intention
    this.limit = limit
    this.test = test
    this.ranked = !test ? ranked : false
    this.time = time
    this.value = value
    this.size = size
    this.specialValue = specialValue
    this.formattedValue = formattedValue
    this.id = id || this.messageId + (multiple ? `-${multiple}` : "")
  }

  stats() {
    return RollStats.fromRoll(this)
  }

  doRollWithID() {
    this.value = this.messageId.substring(6)
    this.calculateRoll()
  }

  doRollWithLimit() {
    this.value = Utils.randomNumber(1, this.limit || Roll.DEFAULT_MAX)
    this.calculateRoll()
  }
  
  calculateRoll() {
    let str = this.value.toString();
    const repeated = Utils.findRepeatedSize(str);
    const pali = Utils.findPalindromeSize(str);
    const straight = Utils.findStraightSize(str);
    const funny = Utils.findFunnyNumberSize(str);
    this.size = Math.max(1, repeated, pali, straight, funny);
    this.specialValue = str.slice(-this.size)
    this.formattedValue = Utils.spliceFromEnd(str, this.size, "**") + "**";
    this.score = Utils.calculateScore(repeated, pali, straight, funny, this.specialValue)
    this.emote = Utils.getEmote(this.specialValue, this.score)
  }

  valueOf() {
    return this.time;
  };
}