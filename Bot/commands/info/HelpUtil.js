const HelpCommand = require("./Help")

module.exports = class HelpUtilCommand extends HelpCommand  {
  static aliases = ["HelpUtil", "HUtil", "HU"]

  getHelpEmbed() {
    return this.helpPresenter.makeUtilHelpEmbed()
  }
}
