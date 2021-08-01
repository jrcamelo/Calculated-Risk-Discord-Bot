const BaseCommand = require("../base_command.js");
const HelpPresenter = require("../../presenters/help_presenter.js");

module.exports = class HelpCommand extends BaseCommand  {
  static aliases = ["Help", "H"]
  static description = "The command used to read this."
  static argsDescription = ""

  canDelete = true

  async execute() {
    this.helpPresenter = new HelpPresenter()
    return this.replyDeletable(this.getHelpEmbed())
  }

  getHelpEmbed() {
    return this.helpPresenter.makeBotHelpEmbed()
  }
}