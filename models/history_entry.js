
module.exports = class HistoryEntry {
  static TYPE = {
    ROLL: 'roll',
    ALLY: 'ally',
    BETRAY: 'betray',
    NAP: 'nap',
    BREAK: 'break',
    CEDE: 'cede',
    VOTE: 'vote',
    SAY: 'say',
    JOIN: 'join',
    LEAVE: 'leave',
    DIE: 'die',
    REVIVE: 'revive',
  }

  static CATEGORY = {
    ROLL: 'roll',
    ALLY: 'diplomacy',
    BETRAY: 'diplomacy',
    NAP: 'diplomacy',
    BREAK: 'diplomacy',
    CEDE: 'diplomacy',
    VOTE: 'diplomacy',
    SAY: 'info',
    JOIN: 'info',
    LEAVE: 'info',
    DIE: 'info',
    REVIVE: 'info',
  }

  constructor(type, history, summary, playerId, time = null, category = null) {
    this.type = type
    this.category = category || CATEGORY[type] || type
    this.history = history
    this.summary = summary
    this.playerId = playerId
    this.time = time || HistoryEntry.now()
  }

  static limitMessageLength(message, length = 300) {
    return message.length > length ? message.substring(0, length) + '...' : message
  }

  static now() {
    // New date as yyyy-mm-dd hh:mm:ss
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  }

  static join(playerId, faction) {
    return new HistoryEntry(
      TYPE.JOIN, 
      `<@!${playerId}> joined as ${faction || "themselves"}`, 
      `<@!${playerId}> joined as ${faction || "themselves"}`, 
      playerId)
  }

  static rename(playerId, faction) {
    return new HistoryEntry(
      TYPE.JOIN, 
      `<@!${playerId}> renamed to ${faction || "themselves"}`, 
      `<@!${playerId}> renamed to ${faction || "themselves"}`,
      playerId)
  }

  static leave(playerId) {
    return new HistoryEntry(
      TYPE.LEAVE, 
      `<@!${playerId}> left the game`, 
      `<@!${playerId}> left the game`, 
      playerId)
  }

  static die(playerId) {
    return new HistoryEntry(
      TYPE.DIE, 
      `<@!${playerId}> died`, 
      `<@!${playerId}> died`, 
      playerId)
  }

  static revive(playerId) {
    return new HistoryEntry(
      TYPE.REVIVE, 
      `<@!${playerId}> was revived`, 
      `<@!${playerId}> was revived`, 
      playerId)
  }

  static say(playerId, message) {
    return new HistoryEntry(
      TYPE.SAY, 
      `<@!${playerId}> said: ${HistoryEntry.limitMessageLength(message)}`,
      `<@!${playerId}> said: ${HistoryEntry.limitMessageLength(message, 100)}`, 
      playerId)
  }

  static vote(playerId, message) {
    return new HistoryEntry(
      TYPE.VOTE,
      `<@!${playerId}> voted: ${HistoryEntry.limitMessageLength(message)}`,
      `<@!${playerId}> voted: ${HistoryEntry.limitMessageLength(message, 100)}`,
      playerId)
  }

  static cede(playerId, message, summary) {
    return new HistoryEntry(
      TYPE.CEDE,
      message,
      summary,
      playerId)
  }

  static roll(playerId, roll, intention) {
    return new HistoryEntry(
      TYPE.ROLL,
      `<@!${playerId}> rolled ${roll}: ${HistoryEntry.limitMessageLength(intention)}`,
      `<@!${playerId}> rolled ${roll}: ${HistoryEntry.limitMessageLength(intention, 100)}`,
      playerId)
  }

  static ally(playerId, allyId) {
    return new HistoryEntry(
      TYPE.ALLY,
      `<@!${playerId}> allied <@!${allyId}>`,
      `<@!${playerId}> allied <@!${allyId}>`,
      playerId)
  }

  static betray(playerId, allyId) {
    return new HistoryEntry(
      TYPE.BETRAY,
      `<@!${playerId}> betrayed <@!${allyId}>`,
      `<@!${playerId}> betrayed <@!${allyId}>`,
      playerId)
  }

  static nap(playerId, allyId) {
    return new HistoryEntry(
      TYPE.NAP,
      `<@!${playerId}> made a NAP with <@!${allyId}>`,
      `<@!${playerId}> made a NAP with <@!${allyId}>`,
      playerId)
  }

  static break(playerId, allyId) {
    return new HistoryEntry(
      TYPE.BREAK,
      `<@!${playerId}> broke NAP with <@!${allyId}>`,
      `<@!${playerId}> broke NAP with <@!${allyId}>`,
      playerId)
  }
}