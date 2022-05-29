const BaseCommand = require("../base_command.js");

module.exports = class WhoRightCommand extends BaseCommand  {
  static aliases = ["Right"]
  static description = "Funny"
  static argsDescription = "funny"

  canDelete = true

  async execute() {
    return this.replyDeletable("Very funny, huh?")
  }
}