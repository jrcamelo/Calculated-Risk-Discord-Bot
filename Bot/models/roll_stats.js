
module.exports = class RollStats {
  constructor(id, messageId, gameTime, turnNumber, time, value, size, specialValue, formattedValue, score) {
    this.id = id;
    this.messageId = messageId;
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