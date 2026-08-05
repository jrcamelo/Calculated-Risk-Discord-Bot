const HelpCommand = require("./Help")

module.exports = class HelpLevelCommand extends HelpCommand  {
  static aliases = ["HelpLevel", "HLevel", "HL"]
  static description = "Information about the XP system. (Aliases: HLevel, HL)"

  getHelpEmbed() {
    return this.helpPresenter.makeLevelHelpEmbed()
  }
}
