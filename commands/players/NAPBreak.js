const BaseCommand = require("../base_command")
module.exports = class PlayerAllyCommand extends BaseCommand {
  static aliases = ["Break", "Wake"]
  static description = "Breaks an Non Aggression Pact with another player."
  static argsDescription = "<@User> <@User> <@User>..."
  static category = "Player"

  canDelete = false
  needsGame = true
  aliveOnly = true
  needsMention = true
  needsMentionedPlayer = true
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
        text += this.tryToBetray(mentionedPlayer)
      }
    }

    if (this.changes) this.turn.calculatePacts()
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "No pacts to break.")
  }

  tryToBetray(mentionedPlayer) {
    if (mentionedPlayer.id === this.player.id) {
      return this.betrayingYourself()
    } 

    if (!this.player.isNAP(mentionedPlayer)) {
      if (mentionedPlayer.isNAP(this.player)) {
        this.changes = true
        mentionedPlayer.break(this.player)
        return this.betrayNonAlly(mentionedPlayer)
      }
      return this.notAllied(mentionedPlayer)
    }

    this.changes = true
    this.player.break(mentionedPlayer)
    const text = this.betrayingPlayer(mentionedPlayer)
    if (mentionedPlayer.isNAP(this.player)) {
      mentionedPlayer.break(this.player)
    }
    return text
  }
  
  userNotInGame(user) {
    return `<@!${user}> is not in the game.\n`
  }

  notAllied(player) {
    return `You don't have a pact with ${player.pingWithFaction()}.\n`
  }

  betrayNonAlly(player) {
    return `${player.pingWithFaction()}'s pact with you is broken.\n`
  }

  betrayingYourself() {
    return `Self-destructive behavior is always allowed.\n`
  }

  betrayingPlayer(player) {
    if (!player.alive) {
      return `How are you going to aggravate the dead?\n`
    } else if (player.isNAP(this.player)) {
      return `You have broken your pact with ${player.pingWithFaction()}. Their pact with you is also broken.\n`
    } else {
      return `You have broken your pact with ${player.pingWithFaction()}, but it seems they already expected that.\n`
    }
  }
}