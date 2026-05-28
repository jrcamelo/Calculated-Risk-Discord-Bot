const BaseCommand = require("../base_command")

module.exports = class SetMaxNAPsCommand extends BaseCommand {
  static aliases = ["SetMaxNAPs", "MaxNAPs", "NAPLimit", "SetMaxNAP", "MaxNAP", "NAPsLimit"]
  static description = "Sets a limit of how many non-aggression pacts (NAPs) each player can have."
  static argsDescription = "[number of NAPs, 0 disables NAPs, no number disables the limit]"
  static category = "Master"

  canDelete = false
  masterOnly = true
  needsGame = true

  async execute() {
    if (this.arg == null || this.arg == "") {
      this.arg = -1
    }
    if (isNaN(this.arg)) {
      return this.replyEphemeral("Invalid number.")
    }
  
    const limit = parseInt(this.arg)
    if (limit < -1 || limit > 10000) {
      return this.replyEphemeral("Invalid number.")
    }
  
    const oldLimit = this.game.maxNAPs
    this.game.maxNAPs = limit
  
    if (this.saveOrReturnWarning()) return
  
    if (limit === -1) {
      return this.replyEphemeral(
        `NAP limit removed. Previous limit was ${oldLimit === -1 ? "none" : oldLimit}.`
      )
    }
  
    if (limit === 0) {
      return this.replyEphemeral(
        `NAPs disabled. Previous limit was ${oldLimit === -1 ? "unlimited" : oldLimit}.`
      )
    }
  
    return this.replyEphemeral(
      `NAP limit set to ${limit}.`
    )
  }  
}