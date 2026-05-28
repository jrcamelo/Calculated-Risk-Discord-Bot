const BaseCommand = require("../base_command")

module.exports = class PlayerClearDiplomacy extends BaseCommand {
  static aliases = ["ClearDiplomacy"]
  static description = "Removes all Alliances and NAPs a player has."
  static argsDescription = "<@User> | Just a User ID if can't ping"
  static category = "Master"

  canDelete = false
  masterOnly = true
  acceptAdmins = true
  acceptModerators = true
  acceptAdmins = true

  needsGame = true
  needsMention = true
  acceptsPlayerNotInServer = true
  needsMentionedPlayer = true
  
  canMention = true

  async execute() {
    this.turn.breakAlliancesAndNAPFromPlayer(this.mentionedPlayer)
    if (this.saveOrReturnWarning()) return
    this.sendReply(`${this.mentionedPlayer.ping()} has had all their Alliances and NAPs cleared.`)
  }
}