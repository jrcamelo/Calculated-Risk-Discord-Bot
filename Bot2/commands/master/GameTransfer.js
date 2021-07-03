const BaseCommand = require("../base_command")

module.exports = class GameTransferCommand extends BaseCommand {
  static aliases = ["TransferGame", "ChangeHost"]
  static description = "Makes a mentioned user the new master of the game."
  static argsDescription = "<@User>"

  canDelete = false
  masterOnly = true
  acceptAdmins = true

  needsGame = true
  needsMention = true
  
  canMention = true

  async execute() {
    const oldMasterId = this.game.master.id
    this.game.transferMaster(this.mentionedUser)
    if (saveOrReturnWarning()) return
    this.sendReply(`<@!${oldMasterId}}> is no more! All hail <@!${this.mentionedUser.id}>, the new Master!`)
  }
}