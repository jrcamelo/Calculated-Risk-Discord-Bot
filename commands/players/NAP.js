const BaseCommand = require("../base_command")

module.exports = class PlayerNAPCommand extends BaseCommand {
  static aliases = ["NAP"]
  static description = "Makes a Non Aggression Pact with another player. Try `Break` and `Pacts` too."
  static argsDescription = "<@User> <@User> <@User>..."
  static category = "Player"

  canDelete = false
  needsGame = true
  playerOnly = true
  aliveOnly = true
  needsMention = true
  canMention = true

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
      text += this.tryToPactWith(mentionedPlayer)
    }

    if (this.changes) this.turn.calculatePacts()
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "No one to make a NAP with.")
  }

  tryToPactWith(mentionedPlayer) {
    if (mentionedPlayer.id === this.player.id) {
      return this.pactingWithYourself()
    }

    const limit = this.game.maxNAPs
    if (limit === 0) {
      return `Non-Aggression Pacts are disabled this game.\n`
    }

    if (limit > 0 && this.player.countNAPs() >= limit) {
      return `You already have the maximum number of Non-Aggression Pacts (${limit}).\n`
    }

    if (this.player.isNAP(mentionedPlayer)) {
      return this.alreadyPacted(mentionedPlayer)
    }

    this.changes = true
    this.player.napWith(mentionedPlayer)
    this.turn.saveNapHistory(this.player, mentionedPlayer)
    return this.pactingWithPlayer(mentionedPlayer)
  }

  userNotInGame(user) {
    return `${user} is not in the game. You can't make a Non-Aggression Pact with them.\n`
  }

  alreadyPacted(player) {
    return `${player.pingWithFaction()} already has a pact with you. If you don't want that, use \`Break\`.\n`
  }

  pactingWithYourself() {
    return `You remain hostile to yourself.\n`
  }

  pactingWithPlayer(player) {
    if (!player.alive) {
      return `You promise not to desecrate the remains of ${player.pingWithFaction()}.\n`
    }
    if (player.isNAP(this.player)) {
      return `You now have a Non-Aggression Pact with ${player.pingWithFaction()}.\n`
    }
    return `You now have a Non-Aggression Pact with ${player.pingWithFaction()}, but they need to make a pact with you as well.\n`
  }
}
