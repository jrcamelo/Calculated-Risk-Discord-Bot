const BaseCommand = require("../base_command.js");

module.exports = class TrollCommand extends BaseCommand  {
  static aliases = ["Troll"]
  static description = "Funny"
  static argsDescription = "funny"

  canDelete = true

  async execute() {
    return this.replyDeletable("<:Troll:1063579260582899772>")
  }
}