const HelpCommand = require("./Help")

module.exports = class HelpMasterCommand extends HelpCommand  {
  static aliases = ["HelpMaster", "HMaster", "HM"]
  static description = "Information about how to host games."

  getHelpEmbed() {
    return this.helpPresenter.makeMasterHelpEmbed()
  }
}
