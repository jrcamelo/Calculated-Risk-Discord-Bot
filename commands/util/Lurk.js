const BaseCommand = require("../base_command")

module.exports = class LurkCommand extends BaseCommand {
  static aliases = ["Lurk"]
  static description = "Become a lurker and get pinged on mups."
  static argsDescription = "[Faction]"
  static category = "Player"

  needsGame = true

  async execute() {
    if (this.turn.getPlayer(this.user)) {
      return this.sendReply("You are already a player. You can't lurk.")
    }
    this.turn.addLurker(this.user, this.arg)
    if (this.saveOrReturnWarning()) return
    let factionName = this.arg ? ` as ${this.arg}` : ""
    return this.sendReply(`You are now lurking${factionName}.`)
  }
}