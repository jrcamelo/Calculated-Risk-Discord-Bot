const BaseCommand = require("../base_command")
module.exports = class PlayerAllyCommand extends BaseCommand {
  static aliases = ["Ally"]
  static description = "Allies with another player. Try `Betray` and `Alliances` too."
  static argsDescription = "<@User> <@User> <@User>..."
  static category = "Player"

  canDelete = false
  needsGame = true
  aliveOnly = true
  needsMention = true
  canMention = false

  async execute() {
    this.changes = false
    let text = ""

    for (const mentionedUser of this.getMentionedUsers()) {
      if (!mentionedUser) continue
      const mentionedPlayer = this.turn.getPlayer(mentionedUser)
      if (!mentionedPlayer) {
        text += this.userNotInGame(mentionedUser)
        continue
      }
      text += this.tryToAllyWith(mentionedPlayer)
    }

    if (this.changes) this.turn.calculateDiplomacy()
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "No one to ally with.")
  }

  tryToAllyWith(mentionedPlayer) {
    if (mentionedPlayer.id === this.player.id) {
      return this.allyingWithYourself()
    }

    const limit = this.game.maxAllies
    if (limit === 0) {
      return `Alliances are disabled this game.\n`
    }

    if (this.player.isAlly(mentionedPlayer)) {
      if (!mentionedPlayer.isAlly(this.player)) return this.waitingAcceptAlliance(mentionedPlayer)
      return this.alreadyAllied(mentionedPlayer)
    }

    if (limit > 0 && this.player.countAllies() >= limit) {
      return `You already have the maximum number of allies (${limit}).\n`
    }

    this.changes = true
    this.player.allyWith(mentionedPlayer)
    this.turn.saveAllyHistory(this.player, mentionedPlayer)
    return this.allyingWithPlayer(mentionedPlayer)
  }

  userNotInGame(user) {
    return `${user} is not in the game.\n`
  }

  alreadyAllied(player) {
    return `${player.pingWithFaction()} is already allied with you. If you don't want that, use \`Betray\`.\n`
  }

  waitingAcceptAlliance(player) {
    return `${player.pingWithFaction()} has not accepted being your ally yet. If you want to give up on them, use \`Betray\`.\n`
  }

  allyingWithYourself() {
    return `You are your own worst enemy. No changing that.\n`
  }

  allyingWithPlayer(player) {
    if (!player.alive) {
      return `You are now allied with the already dead ${player.pingWithFaction()}. That's okay.\n`
    }
    if (player.isAlly(this.player)) {
      return `You are now allied with ${player.pingWithFaction()}.\n`
    }
    return `You are now allied with ${player.pingWithFaction()}, but they need to ally with you as well.\n`
  }
}
