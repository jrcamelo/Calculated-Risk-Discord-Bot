
module.exports = class RollStats {
  constructor(id, messageId, playerId, channelId, gameTime, turnNumber, time, value, size, specialValue, formattedValue, score) {
    this.id = id;
    this.messageId = messageId;
    this.playerId = playerId;
    this.channelId = channelId
    this.gameTime = gameTime;
    this.turnNumber = turnNumber;
    this.time = time;
    this.value = value;
    this.size = size;
    this.specialValue = specialValue;
    this.formattedValue = formattedValue;
    this.score = score;
  }

  static fromRoll(roll) {
    return new RollStats(
      roll.id,
      roll.messageId,
      roll.playerId,
      roll.channelId,
      roll.gameTime,
      roll.turnNumber,
      roll.time,
      roll.value,
      roll.size,
      roll.specialValue,
      roll.formattedValue,
      roll.score
    );
  }
}