const BaseCommand = require("../base_command.js");
const HelpPresenter = require("../../presenters/help_presenter.js");
const Parser = require("../../handler/parser");


module.exports = class HelpCommand extends BaseCommand  {
  static aliases = ["Help", "H", "Rules"]
  static description = "The command used to read this."
  static argsDescription = ""

  canDelete = true
  ephemeral = true
  getsGame = false
  canStopEphemeral = true

  async execute() {
    this.helpPresenter = new HelpPresenter()
    return this.replyDeletable(this.getHelpEmbed())
  }

  getHelpEmbed() {
    if (this.arg) {
      const commandEmbed = this.helpPresenter.makeCommandEmbed(this.arg)
      if (commandEmbed) return commandEmbed

      switch (this.arg.toLowerCase()) {
        case "master":
        case "m":
          return this.helpPresenter.makeMasterHelpEmbed()
        case "player":
        case "p":
          return this.helpPresenter.makePlayerHelpEmbed()
        case "level":
        case "levels":
        case "xp":
          return this.helpPresenter.makeLevelHelpEmbed()
        case "util":
        case "utils":
        case "utility":
        case "u":
          return this.helpPresenter.makeUtilHelpEmbed()
      }
    }
    return this.helpPresenter.makeBotHelpEmbed()
  }
}