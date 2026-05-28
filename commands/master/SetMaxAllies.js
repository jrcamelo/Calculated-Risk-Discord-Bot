const BaseCommand = require("../base_command")

module.exports = class SetMaxAlliesCommand extends BaseCommand {
  static aliases = ["SetMaxAllies", "MaxAllies", "AllyLimit"]
  static description = "Sets a limit of how many allies each player can have."
  static argsDescription = "[number of allies, 0 disables alliances, no number disables the limit]"
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
  
    const oldLimit = this.game.maxAllies
    this.game.maxAllies = limit
  
    if (this.saveOrReturnWarning()) return
  
    if (limit === -1) {
      return this.replyEphemeral(
        `Ally limit removed. Previous limit was ${oldLimit === -1 ? "none" : oldLimit}.`
      )
    }
  
    if (limit === 0) {
      return this.replyEphemeral(
        `Alliances disabled. Previous limit was ${oldLimit === -1 ? "unlimited" : oldLimit}.`
      )
    }
  
    return this.replyEphemeral(
      `Ally limit set to ${limit}.`
    )
  }  
}