const BaseCommand = require("../base_command.js");

module.exports = class WhackSorryAssCommand extends BaseCommand  {
  static aliases = ["WhackSorryAss"]
  static description = "Funny"
  static argsDescription = "funny"

  canDelete = true

  async execute() {
    if (this.isOwner() && this.mentionedPlayer) {
      return this.replyDeletable(`<@!${this.mentionedUser.id}>'s sorry ass has been whacked`)
    }
  }
}