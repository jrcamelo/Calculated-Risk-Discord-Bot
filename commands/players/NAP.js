const BaseCommand = require("../base_command")
module.exports = class PlayerNAPCommand extends BaseCommand {
  static aliases = ["NAP"]
  static description = "Makes a Non Agression Pact with another player. Try `Break` and `Pacts` too."
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
    for (let mentionedUser of this.getMentionedUsers()) {
      if (!mentionedUser) continue
      const mentionedPlayer = this.turn.getPlayer(mentionedUser)
      if (!mentionedPlayer) {
        text += this.userNotInGame(mentionedUser)
      } else {
        text += this.tryToAllyWith(mentionedPlayer)
      }
    }

    if (this.changes) this.turn.calculatePacts()
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "No one to ally with.")
  }

  tryToAllyWith(mentionedPlayer) {
    if (this.player.isNAP(mentionedPlayer)) {
      return this.alreadyAllied(mentionedPlayer)
    }
    if (mentionedPlayer.id === this.player.id) {
      return this.allyingWithYourself()
    } 
    this.changes = true
    this.player.napWith(mentionedPlayer)
    this.turn.saveNapHistory(this.player, mentionedPlayer)
    return this.allyingWithPlayer(mentionedPlayer)
  }
  
  userNotInGame(user) {
    return `${user} is not in the game. You can't attack them.\n`
  }

  alreadyAllied(player) {
    return `${player.pingWithFaction()} is already has a pact with you. If you don't want that, use \`Break\`.\n`
  }

  allyingWithYourself() {
    return `You remain aggressive towards yourself.\n`
  }

  allyingWithPlayer(player) {
    if (!player.alive) {
      return `You promise to not desecrate the remains of ${player.pingWithFaction()}.\n`
    } else if (player.isNAP(this.player)) {
      return `You now have a pact with ${player.pingWithFaction()}.\n`
    } else {
      return `You now have a Non Aggression Pact with ${player.pingWithFaction()}, but they need to make a pact with you as well.\n`
    }
  }
}