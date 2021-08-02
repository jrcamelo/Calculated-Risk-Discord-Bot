module.exports = class Task {
  constructor(options) {
    this.options = options
    this.name = "BASE TASK!?"
  }

  tryExecute() {
    try {
      this.prepare()
      return this.execute()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async prepare() {
  }

  async execute() {
  }

  addToQueue() {
  }
}