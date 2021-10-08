const HelpCommand = require("./Help")

module.exports = class HelpUtilCommand extends HelpCommand  {
  static aliases = ["HelpUtil", "HUtil", "HU"]
  static description = "Information about some extra commands."

  getHelpEmbed() {
    return this.helpPresenter.makeUtilHelpEmbed()
  }
}
