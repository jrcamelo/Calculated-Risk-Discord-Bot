
module.exports = class GameStats {
  constructor(id, name, masterId, masterUsername, channel, turnNumber, startedAt, endedAt, players) {
    this.id = id;
    this.name = name;
    this.masterId = masterId;
    this.masterUsername = masterUsername;
    this.channel = channel;
    this.turnNumber = turnNumber;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
    this.players = players;
  }

  static fromGame(game) {
    return new GameStats(
      game.uniqueId,
      game.name,
      game.masterId,
      game.masterUsername,
      game.channel,
      game.turnNumber,
      game.startedAt,
      game.endedAt,
      game._turn.playersToNewTurn(game._turn._players)
    );
  }
}