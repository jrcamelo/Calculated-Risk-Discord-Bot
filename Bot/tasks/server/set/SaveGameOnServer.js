const ServerTask = require('../task_server');
const GameStats = require('../../../models/game_stats');

module.exports = class SaveGameOnServerTask extends ServerTask {
  constructor(serverId, game, options) {
    super(serverId, options);
    this.game = game;
    this.name = 'SaveGameOnServer';
  }
  
  async prepare() {
    return await this.loadGameDatabase()
  }

  async execute() {
    const stats = GameStats.fromGame(this.game);
    return await this.games.upsertGame(stats)
  }
}