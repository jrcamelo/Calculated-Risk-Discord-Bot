const { MessageEmbed } = require("discord.js")
const BaseCommand = require("../base_command")

module.exports = class LuckCommand extends BaseCommand {
  static aliases = ["Luck", "GameLuck"]
  static description = "Shows how lucky each player has been in this game."
  static argsDescription = "[Turn]"
  static category = "Game"

  canDelete = true
  needsGame = true

  async execute() {
    const turnIndex = this.getTurnIndex()
    if (turnIndex == null) {
      return this.replyDeletable(`Try again with ${this.constructor.argsDescription}`)
    }

    const embed = this.makeEmbed(turnIndex)
    return await this.sendReply(embed)
  }

  getTurnIndex() {
    if (!this.arg) return this.game.turnNumber
    if (!/^\d+$/.test(this.arg)) return null

    const turnIndex = parseInt(this.arg, 10)
    if (turnIndex < 0 || turnIndex > this.game.turnNumber) return null
    return turnIndex
  }

  makeEmbed(turnIndex) {
    const turn = this.game.getTurn(turnIndex)
    const lines = []

    for (const player of turn.playerHashToList()) {
      lines.push(this.makePlayerLine(player, turnIndex))
    }

    return new MessageEmbed()
      .setTitle(`${this.game.name} Luck`)
      .setDescription(lines.join("\n") || "No players")
      .setFooter(`Turn ${turnIndex}/${this.game.turnNumber}`)
  }

  makePlayerLine(player, turnIndex) {
    const stats = this.getPlayerLuckInGame(player.id, turnIndex)
    const name = this.makePlayerName(player)

    if (stats.rolls === 0) {
      return `${name} - no rolls yet`
    }

    const avg = stats.score / stats.rolls
    return `${name} - ${avg.toFixed(0)} luck (${stats.score} pts / ${stats.rolls} rolls)`
  }

  makePlayerName(player) {
    const faction = player.name ? ` [${player.name}]` : ""
    const base = `**${player.username}**${faction}`
    if (player.alive) return base
    return `~~${player.username}~~${faction}`
  }

  getPlayerLuckInGame(playerId, turnIndex) {
    let score = 0
    let rolls = 0

    for (let i = 0; i <= turnIndex; i++) {
      const turn = this.game.getTurn(i)
      if (!turn || !turn._rolls) continue

      for (const roll of turn._rolls) {
        if (roll.playerId !== playerId) continue
        score += roll.score || 0
        rolls += 1
      }
    }

    return { score, rolls }
  }
}
