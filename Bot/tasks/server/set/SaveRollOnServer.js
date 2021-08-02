const ServerTask = require('../task_server');

module.exports = class SaveRollOnServerTask extends ServerTask {
  constructor(serverId, roll, options) {
    super(serverId, options);
    this.roll = roll
    this.name = 'SaveRollOnServer';
  }
  
  async prepare() {
    return await this.loadRollDatabase();
  }

  async execute() {
    return await this.rolls.insertRoll(this.roll);
  }
}