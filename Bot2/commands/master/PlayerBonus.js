const BaseCommand = require("../base_command")

module.exports = class PlayerBonusCommand extends BaseCommand {
  static aliases = ["SetBonus", "Bonus", "B"]
  static description = "Sets a bonus for a player's rolls. (Accepts many players with | )"
  static argsDescription = "<@User> <Bonus> | <@User> <Bonus>"

  canDelete = false
  masterOnly = true

  needsGame = true
  
  async execute() {
    let resultMessage = ""
    for (const command of this.getMultipleMentionsAndArgs()) {
      const { id, mention, arg } = command
      const player = this.turn.getPlayer({ id })
      if (!mention || !player) {
        resultMessage += `**${mention}** is not a valid player.\n`
      } else {
        player.setBonus(arg)
        resultMessage += `**${mention}** now has a bonus of **${player.bonus}**.\n`
      }
    }
    if (this.saveOrReturnWarning()) return
    await this.replyDeletable(resultMessage || "No valid players found.")
  }
}