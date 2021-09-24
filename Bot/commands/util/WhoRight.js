const BaseCommand = require("../base_command.js");
const HelpPresenter = require("../../presenters/help_presenter.js");

module.exports = class HelpCommand extends BaseCommand  {
  static aliases = ["Right"]
  static description = "Funny"
  static argsDescription = "funny"

  canDelete = true

  async execute() {
    return this.replyDeletable("Very funny, huh?")
  }
}