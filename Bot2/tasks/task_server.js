const Task = require('./task_base');
const TaskConductor = require('../handler/taskConductor');

module.exports = class ServerTask extends Task {
  constructor(serverId, options) {
    super(options);
    this.serverId = serverId;
    this.name = 'BASE SERVER TASK!?';
  }
  
  prepare() {
  }

  execute() {
  }

  loadServerGamesDatabase() {
  }

  loadPlayerDatabase() {
    if (!this.playerId) return
  }

  loadServerDatabase() {
  }

  addToQueue() {
    TaskConductor.addServerTask(this)
  }
}