const BaseCommand = require("../base_command.js");
const HelpPresenter = require("../../presenters/help_presenter.js");
const Parser = require("../../handler/parser");


module.exports = class HelpCommand extends BaseCommand  {
  static aliases = ["Help", "H", "Rules"]
  static description = "The command used to read this. (Aliases: H, Rules)"
  static argsDescription = ""

  canDelete = true
  ephemeral = true
  getsGame = false
  canStopEphemeral = false

  async execute() {
    this.helpPresenter = new HelpPresenter()
    return this.replyDeletable(this.getHelpEmbed())
  }

  async beforeSlashControls() {
    await this.addHelpButtons()
  }

  async addHelpButtons() {
    if (!this.valid || !this.reply || !this.message._isSlashCommand) return
    if (!this.reactions) this.reactions = {}
    this.reactions.help_main = this.showMainHelp
    this.reactions.help_player = this.showPlayerHelp
    this.reactions.help_master = this.showMasterHelp
    this.reactions.help_level = this.showLevelHelp
    this.reactions.help_util = this.showUtilHelp
  }

  async showMainHelp(_collected, command) {
    await command.reply.edit(command.helpPresenter.makeBotHelpEmbed())
  }

  async showPlayerHelp(_collected, command) {
    await command.reply.edit(command.helpPresenter.makePlayerHelpEmbed())
  }

  async showMasterHelp(_collected, command) {
    await command.reply.edit(command.helpPresenter.makeMasterHelpEmbed())
  }

  async showLevelHelp(_collected, command) {
    await command.reply.edit(command.helpPresenter.makeLevelHelpEmbed())
  }

  async showUtilHelp(_collected, command) {
    await command.reply.edit(command.helpPresenter.makeUtilHelpEmbed())
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
