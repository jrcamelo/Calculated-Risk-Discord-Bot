const HelpCommand = require("./Help")

module.exports = class HelpMasterCommand extends HelpCommand  {
  static aliases = ["HelpMaster", "HMaster", "HM"]

  getHelpEmbed() {
    return this.helpPresenter.makeMasterHelpEmbed()
  }
}
