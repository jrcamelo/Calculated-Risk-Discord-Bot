const BaseCommand = require("../base_command")

module.exports = class PlayerAddCommand extends BaseCommand {
  static aliases = ["Add", "Change"]
  static description = "Adds a player to the game. Use it on an existing player to change their faction name."
  static argsDescription = "<@User> [New faction name]"

  canDelete = false
  masterOnly = true

  needsGame = true
  needsMention = true

  ignoreFirstArg = true
  
  canMention = true

  async execute() {   
    if (this.mentionedPlayer) {
      const existingPlayerName = this.mentionedPlayer ? this.mentionedPlayer.name : "[Blank]"
      if (existingPlayerName == this.arg || "[Blank]")
        return this.replyDeletable("No point in doing that...")
      this.turn.renamePlayer(this.mentionedPlayer, this.arg)
      if (this.saveOrReturnWarning()) return
      return this.sendReply(`${existingPlayerName} has been changed to ${this.arg || "[Blank]"}`)
    } else {
      const newPlayer = this.turn.addPlayer(this.mentionedUser, this.arg)
      if (this.saveOrReturnWarning()) return
      return this.sendReply(`${newPlayer.pingWithFaction()} has been added!`)
    }
  }
}