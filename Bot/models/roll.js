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
    this.multiple = multiple
    this.time = time
    this.value = value
    this.size = size
    this.specialValue = specialValue
    this.formattedValue = formattedValue
    this.id = id || messageId + (this.multiple ? `-${this.multiple}` : "")
  }

  doRollWithID() {
    this.value = this.messageId
    this.calculateRoll()
  }

  doRollWithLimit() {
    this.value = Utils.randomNumber(1, this.limit || Roll.DEFAULT_MAX)
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
    this.score = Utils.calculateScore(this.repeated, this.pali,this.straight, this.funny, this.specialValue)
    this.emote = Utils.getEmote(this.specialValue, this.score)
  }

  valueOf() {
    return this.time;
  };
}