const ServerTask = require('../task_server');

module.exports = class SaveMultipleRollsOnServerTask extends ServerTask {
  constructor(serverId, multipleRolls, options) {
    super(serverId, options);
    this.multipleRolls = multipleRolls;
    this.name = 'SaveMultipleRollsOnServer';
  }
  
  async prepare() {
    return await this.loadRollDatabase()
  }

  async execute() {
    let i = 0;
    for (let roll of this.multipleRolls) {
      i += 1
      await this.addRoll(roll);
    }
  }

  async addRoll(roll) {
    return await this.rolls.insertRoll(roll)
  }
}