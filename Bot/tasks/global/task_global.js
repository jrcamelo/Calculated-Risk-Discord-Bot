const Task = require('../task_base');
const TaskConductor = require('../../handler/taskConductor');

module.exports = class GlobalTask extends Task {
  constructor(options) {
    super(options);
    this.name = 'BASE GLOBAL TASK!?';
  }
    
  async prepare() {
  }

  async execute() {
  }

  addToQueue() {
    TaskConductor.addGlobalTask(this)
  }
}