const BaseCommand = require("../base_command")
module.exports = class PlayerBetrayAllyCommand extends BaseCommand {
  static aliases = ["Betray"]
  static description = "Breaks an alliance with another player."
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

    if (this.changes) this.turn.calculateDiplomacy()
    if (this.saveOrReturnWarning()) return
    await this.sendReply(text || "No one to betray.")
  }

  tryToBetray(mentionedPlayer) {
    if (mentionedPlayer.id === this.player.id) {
      return this.betrayingYourself()
    } 

    if (!this.player.isAlly(mentionedPlayer)) {
      if (mentionedPlayer.isAlly(this.player)) {
        this.changes = true
        mentionedPlayer.betray(this.player)
        return this.betrayNonAlly(mentionedPlayer)
      }
      return this.notAllied(mentionedPlayer)
    }

    this.changes = true
    this.player.betray(mentionedPlayer)
    const text = this.betrayingPlayer(mentionedPlayer)
    if (mentionedPlayer.isAlly(this.player)) {
      mentionedPlayer.betray(this.player)
    }
    this.turn.saveBetrayHistory(this.player, mentionedPlayer)
    return text
  }
  
  userNotInGame(user) {
    return `<@!${user}> is not in the game.\n`
  }

  notAllied(player) {
    return `You are not allied with ${player.pingWithFaction()}.\n`
  }

  betrayNonAlly(player) {
    return `${player.pingWithFaction()}'s alliance with you is broken.\n`
  }

  betrayingYourself() {
    return `You are already your own worst enemy.\n`
  }

  betrayingPlayer(player) {
    if (!player.alive) {
      return `Abandoning dead allies... Classic.\n`
    } else if (player.isAlly(this.player)) {
      return `You have betrayed ${player.pingWithFaction()}. Their alliance with you is also broken.\n`
    } else {
      return `You have betrayed ${player.pingWithFaction()}, but it seems they already expected that.\n`
    }
  }
}