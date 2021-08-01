const BaseCommand = require("../base_command")

module.exports = class PlayerAddCommand extends BaseCommand {
  static aliases = ["Add", "Change"]
  static description = "Adds a player to the game. Existing players are renamed. \nAccepts many players with |"
  static argsDescription = "<@User> [Faction] | <@User> [Faction]"
  static category = "Master"

  canDelete = false
  masterOnly = true

  needsGame = true
  needsMention = true
  
  async execute() {
    let resultMessage = ""
    const mentionedUsersHash = this.getMentionedUsersAsHash()
    for (const command of this.getMultipleMentionsAndArgs()) {
      const { id, mention, arg } = command
      const player = this.turn.getPlayer({ id })
      if (player) {
        resultMessage += this.renamePlayer(mention, arg, player)
      } else {
        resultMessage += this.addPlayer(mention, arg, id, mentionedUsersHash)
      }
    }

    if (this.saveOrReturnWarning()) return
    return this.sendReply(resultMessage || "No valid players found.")
  }

  renamePlayer(mention, arg, player) {
    const existingPlayerName = player.name || "[Blank]"
    console.log(player)
    if (existingPlayerName == arg || existingPlayerName == "[Blank]") {
      return `No point in renaming ${mention} as ${arg}...\n`
    }
    this.turn.renamePlayer(player, arg)
    return `${mention} **${existingPlayerName}** has been changed to **${arg || "[Blank]"}**\n`
  }

  addPlayer(mention, arg, id, users) {
    const user = users[id]
    if (!user) return `${mention} is not a valid user!`
    const newPlayer = this.turn.addPlayer(user, arg)
    return `${newPlayer.pingWithFaction()} has been added!\n`
  }

}