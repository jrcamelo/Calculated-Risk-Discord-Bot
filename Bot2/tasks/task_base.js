const TaskConductor = require('../handler/taskConductor');

module.exports = class Task {
  constructor(options) {
    this.options = options
    this.name = "BASE TASK!?"
  }

  tryExecute() {
    try {
      this.prepare()
      this.execute()
    } catch (e) {
      console.log(e)
    }
  }

  prepare() {
  }

  execute() {
  }
}