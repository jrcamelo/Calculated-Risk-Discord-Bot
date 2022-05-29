const BaseCommand = require("../base_command.js");

module.exports = class PongCommand extends BaseCommand  {
  static aliases = ["Pong"]
  static description = "Funny"
  static argsDescription = "funny"

  canDelete = true

  async execute() {
    return this.replyDeletable("🏓")
  }
}