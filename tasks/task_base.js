module.exports = class Task {
  constructor(options) {
    this.options = options
    this.name = "BASE TASK!?"
  }

  async tryExecute() {
    try {
      await this.prepare()
      return await this.execute()
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