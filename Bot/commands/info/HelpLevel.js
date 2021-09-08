const HelpCommand = require("./Help")

module.exports = class HelpLevelCommand extends HelpCommand  {
  static aliases = ["HelpLevel", "HLevel", "HL"]

  getHelpEmbed() {
    return this.helpPresenter.makeLevelHelpEmbed()
  }
}
