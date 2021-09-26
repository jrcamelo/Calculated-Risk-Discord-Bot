const HelpCommand = require("./Help")

module.exports = class HelpPlayerCommand extends HelpCommand  {
  static aliases = ["HelpPlayer", "HPlayer", "HP"]
  static description = "Information about how to play."

  getHelpEmbed() {
    return this.helpPresenter.makePlayerHelpEmbed()
  }
}
