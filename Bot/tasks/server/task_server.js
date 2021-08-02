const Task = require('../task_base');
const TaskConductor = require('../../handler/taskConductor');
const GamesDb = require("../../database/nedb/server/games")
const PlayerDb = require("../../database/nedb/server/players")
const RollsDb = require("../../database/nedb/server/rolls")

module.exports = class ServerTask extends Task {
  constructor(serverId, options) {
    super(options);
    this.serverId = serverId;
    this.name = 'BASE SERVER TASK!?';
  }
  
  async prepare() {
  }

  async execute() {
  }

  loadGameDatabase() {
    this.games = new GamesDb(this.serverId)
  }

  loadPlayerDatabase() {
    this.players = new PlayerDb(this.serverId)
  }

  loadRollDatabase() {
    this.rolls = new RollsDb(this.serverId)
  }

  addToQueue() {
    TaskConductor.addServerTask(this)
  }
}