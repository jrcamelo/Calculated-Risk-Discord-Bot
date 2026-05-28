const Discord = require("discord.js")
const PaginatedCommand = require("../paginated_command")
const Database = require("../../database")
const GetServerGames = require("../../tasks/server/get/GetServerGames")
const OldStatusCommand = require("../info/OldStatus")
const ChannelStatusCommand = require("../info/ChannelStatus")
const { channelMention, userIdtoDiscordPing } = require("../../utils/discord")
const { timestampToLocale } = require("../../utils/text")

module.exports = class GamesCommand extends PaginatedCommand {
  static aliases = ["Games", "BrowseGames"]
  static description = "Browse all current and previous games in this server."
  static argsDescription = "[<Channel ID or Game Name>]"

  canDelete = true
  shouldLoop = true
  getsGame = false
  hasExpand = true

  async execute() {
    this.index = 0
    this.step = 1
    this.channelFilterIds = this.getChannelFilterIds()

    if (this.arg && this.channelFilterIds.length === 0) {
      return this.replyDeletable("No channel found with that id or name.")
    }

    this.games = await this.getAllGames()

    this.ceiling = this.games.length - 1
    if (this.ceiling < 0) {
      return this.replyDeletable("No games were found in this server.")
    }

    await this.sendReply(await this.getReply())
  }

  async getReply() {
    return this.makeEmbed(this.games[this.index], this.index, this.games.length)
  }

  async doExpand(_collected, command) {
    const game = command.games[command.index]
    if (!game) return

    if (game.isPrevious) {
      const oldStatus = new OldStatusCommand(command.message, game.channelId, command.serverId, game.gameId)
      await oldStatus.prepare()
      if (oldStatus.game) await oldStatus.tryExecute()
    } else {
      const status = new ChannelStatusCommand(command.message, game.channelId, command.serverId)
      await status.prepare()
      if (status.game) await status.tryExecute()
    }

    await command.deleteReply(_collected, command)
  }

  async getAllGames() {
    const currentGames = this.getCurrentGames()
    const previousGames = await this.getPreviousGames()
    const entries = currentGames.concat(previousGames)
    entries.sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0))
    return entries
  }

  getCurrentGames() {
    const entries = []
    for (const channel of this.server.channels.cache.values()) {
      if (this.channelFilterIds && !this.channelFilterIds.includes(channel.id)) continue

      const database = new Database(channel)
      const game = database.getGame()
      if (!game) continue

      entries.push({
        id: `current:${channel.id}`,
        type: "Current",
        isPrevious: false,
        channelId: channel.id,
        channelName: channel.name,
        name: game.name,
        masterId: game.masterId,
        startedAt: game.startedAt,
        endedAt: game.endedAt,
        turnNumber: game.turnNumber,
        mup: game.getTurn() ? game.getTurn().mup : null,
      })
    }
    return entries
  }

  async getPreviousGames() {
    const filter = this.makePreviousGamesFilter()
    const task = new GetServerGames(this.serverId, 0, 0, filter, { startedAt: -1 })
    const previousGames = await task.tryExecute() || []

    return previousGames.map(game => ({
      id: `previous:${game.channel}:${game.id}`,
      type: "Previous",
      isPrevious: true,
      channelId: game.channel,
      channelName: this.server.channels.cache.get(game.channel)?.name,
      gameId: game.id.split("-")[1],
      name: game.name,
      masterId: game.masterId,
      startedAt: game.startedAt,
      endedAt: game.endedAt,
      turnNumber: game.turnNumber,
      mup: game.mup,
    }))
  }

  makeEmbed(game, index, total) {
    const embed = new Discord.MessageEmbed()
      .setTitle(game.name || "Untitled game")
      .setDescription(this.makeDescription(game))
      .setFooter(`Game ${index + 1} / ${total}`)

    if (game.mup) embed.setThumbnail(game.mup)
    return embed
  }

  makeDescription(game) {
    const lines = [
      `**Type**: ${game.type}`,
      `**Channel**: ${channelMention(game.channelId)} (${game.channelId})`,
      `**Master**: ${userIdtoDiscordPing(game.masterId)}`,
      `**Started**: ${timestampToLocale(game.startedAt)}`,
      `**Turns**: ${game.turnNumber}`,
    ]

    if (game.channelName) {
      lines.splice(2, 0, `**Channel Name**: #${game.channelName}`)
    }

    if (game.endedAt) {
      lines.push(`**Finished**: ${timestampToLocale(game.endedAt)}`)
    }

    if (game.isPrevious) {
      lines.push(`**Game Id**: ${game.gameId}`)
      lines.push(`**Open**: \`${process.env.PREFIX}GameID ${game.channelId} ${game.gameId}\` or click ⏩`)
    } else {
      lines.push(`**Open**: \`${process.env.PREFIX}GameID ${game.channelId}\` or click ⏩`)
    }
    return lines.join("\n")
  }

  getChannelFilterIds() {
    if (!this.arg) return null

    const filter = this.arg.trim().toLowerCase()
    const mentionMatch = filter.match(/^<#(\d{17,20})>$/)
    const rawId = mentionMatch ? mentionMatch[1] : filter

    return Array.from(this.server.channels.cache.values())
      .filter(channel => this.matchesChannelFilter(channel, rawId, filter))
      .map(channel => channel.id)
  }

  matchesChannelFilter(channel, rawId, filter) {
    if (!channel || !channel.guild) return false
    if (channel.id === rawId) return true
    if (!channel.name) return false
    return channel.name.toLowerCase().includes(filter)
  }

  makePreviousGamesFilter() {
    if (!this.channelFilterIds) return {}
    return { channel: { $in: this.channelFilterIds } }
  }
}
