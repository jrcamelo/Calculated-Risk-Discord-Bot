const BaseCommand = require("../base_command")

module.exports = class GameTransferCommand extends BaseCommand {
  static aliases = ["TransferGame"]
  static description = "Makes a mentioned user the new master of the game."
  static argsDescription = "<@User>"
  static category = "Master"

  canDelete = false
  masterOnly = false
  acceptModerators = true
  acceptAdmins = true

  needsGame = true
  needsMention = true
  
  canMention = true

  async validate() {
    const validationError = await super.validate()
    if (validationError) return validationError

    if (!this.isMaster() && !this.isModerator() && !this.isAdmin()) {
      return `Only the current Master <@!${this.game.masterId}> or a server moderator/admin can transfer this game.`
    }
  }

  async execute() {
    const oldMasterId = this.game.masterId
    this.game.transferMaster(this.mentionedUser)
    if (this.saveOrReturnWarning()) return
    this.sendReply(`<@!${oldMasterId}> is no more! All hail <@!${this.mentionedUser.id}>, the new Master!`)
  }
}
