const HelpCommand = require("./Help")

module.exports = class HelpPlayerCommand extends HelpCommand  {
  static aliases = ["HelpPlayer", "HPlayer", "HP"]

  getHelpEmbed() {
    return this.helpPresenter.makePlayerHelpEmbed()
  }
}
