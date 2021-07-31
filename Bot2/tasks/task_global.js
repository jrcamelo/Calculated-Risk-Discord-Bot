const Task = require('./task_base');

module.exports = class GlobalTask extends Task {
  constructor(options) {
    super(options);
    this.name = 'BASE GLOBAL TASK!?';
  }
    
  prepare() {
  }

  execute() {
  }

  addToGlobalQueue() {
    TaskConductor.addGlobalTask(this)
  }
}