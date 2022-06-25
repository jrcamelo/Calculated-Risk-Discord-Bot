
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
    this.category = category || HistoryEntry.CATEGORY[type] || type
    this.history = history
    this.summary = summary
    this.playerId = playerId
    this.time = time || HistoryEntry.now()
  }

  static limitMessageLength(originalMessage, length = 300) {
    let message = originalMessage.replace(/\n/g, " ... ");
    return message.length > length ? message.substring(0, length) + '...' : message
  }

  static now() {
    // New date as yyyy-mm-dd hh:mm:ss
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  }

  static join(playerId, faction) {
    return new HistoryEntry(
      HistoryEntry.TYPE.JOIN, 
      `<@!${playerId}> joined as ${faction || "themselves"}`, 
      `<@!${playerId}> joined as ${faction || "themselves"}`, 
      playerId)
  }

  static rename(playerId, faction) {
    return new HistoryEntry(
      HistoryEntry.TYPE.JOIN, 
      `<@!${playerId}> renamed to ${faction || "themselves"}`, 
      `<@!${playerId}> renamed to ${faction || "themselves"}`,
      playerId)
  }

  static leave(playerId) {
    return new HistoryEntry(
      HistoryEntry.TYPE.LEAVE, 
      `<@!${playerId}> left the game`, 
      `<@!${playerId}> left the game`, 
      playerId)
  }

  static kill(playerId) {
    return new HistoryEntry(
      HistoryEntry.TYPE.DIE, 
      `<@!${playerId}> died`, 
      `<@!${playerId}> died`, 
      playerId)
  }

  static revive(playerId) {
    return new HistoryEntry(
      HistoryEntry.TYPE.REVIVE, 
      `<@!${playerId}> was revived`, 
      `<@!${playerId}> was revived`, 
      playerId)
  }

  static say(playerId, message) {
    return new HistoryEntry(
      HistoryEntry.TYPE.SAY, 
      `${HistoryEntry.limitMessageLength(message)}`,
      `${HistoryEntry.limitMessageLength(message, 100)}`, 
      playerId)
  }

  static vote(playerId, message) {
    return new HistoryEntry(
      HistoryEntry.TYPE.VOTE,
      `<@!${playerId}> voted: ${HistoryEntry.limitMessageLength(message)}`,
      `<@!${playerId}> voted: ${HistoryEntry.limitMessageLength(message, 100)}`,
      playerId)
  }

  static cede(playerId, message, summary) {
    return new HistoryEntry(
      HistoryEntry.TYPE.CEDE,
      message,
      summary,
      playerId)
  }

  static roll(playerId, roll, intention) {
    return new HistoryEntry(
      HistoryEntry.TYPE.ROLL,
      `<@!${playerId}> rolled ${roll}${intention ? ": " : ""}${HistoryEntry.limitMessageLength(intention)}`,
      `<@!${playerId}> rolled ${roll}${intention ? ": " : ""}${HistoryEntry.limitMessageLength(intention, 100)}`,
      playerId)
  }

  static ally(playerId, allyId) {
    return new HistoryEntry(
      HistoryEntry.TYPE.ALLY,
      `<@!${playerId}> allied <@!${allyId}>`,
      `<@!${playerId}> allied <@!${allyId}>`,
      playerId)
  }

  static betray(playerId, allyId) {
    return new HistoryEntry(
      HistoryEntry.TYPE.BETRAY,
      `<@!${playerId}> betrayed <@!${allyId}>`,
      `<@!${playerId}> betrayed <@!${allyId}>`,
      playerId)
  }

  static nap(playerId, allyId) {
    return new HistoryEntry(
      HistoryEntry.TYPE.NAP,
      `<@!${playerId}> made a NAP with <@!${allyId}>`,
      `<@!${playerId}> made a NAP with <@!${allyId}>`,
      playerId)
  }

  static break(playerId, allyId) {
    return new HistoryEntry(
      HistoryEntry.TYPE.BREAK,
      `<@!${playerId}> broke NAP with <@!${allyId}>`,
      `<@!${playerId}> broke NAP with <@!${allyId}>`,
      playerId)
  }
}