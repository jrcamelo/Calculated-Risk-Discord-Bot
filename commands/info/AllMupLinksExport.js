const Discord = require("../../utils/discord_compat")
const BaseCommand = require("../base_command")
const Database = require("../../database")
const ChannelStatusCommand = require("./ChannelStatus")
const OldStatusCommand = require("./OldStatus")

module.exports = class MupLinksExportCommand extends BaseCommand {
  static aliases = ["MupLinkExport", "MupLinksExport", "MupLinksTXT"]
  static description = "Exports all MUP links in a game to a TXT file."
  static argsDescription = "[ChannelId] [GameId]"
  static category = "Game"

  getsGame = false
  canDelete = true

  async execute() {
    const loaded = await this.loadRequestedGame()
    if (loaded.error) {
      return this.replyDeletable(loaded.error)
    }

    const content = this.makeExportText(loaded.game)
    const filename = this.makeFilename(loaded.game, loaded.isPrevious)
    return await this.sendFileMessage(filename, content, "")
  }

  async sendFileMessage(filename, content, message = "") {
    const attachment = new Discord.MessageAttachment(
      Buffer.from(content, "utf8"),
      filename
    )
    const options = {
      files: [attachment],
    }
    if (!this.canMention) options.allowedMentions = { parse: [] }
    this.reply = await this.doSendReply(message, options)
    await this.afterReply()
    return this.reply
  }

  async loadRequestedGame() {
    if (!this.args.length) {
      const database = new Database(this.message.channel)
      const game = database.getGame()
      if (!game) {
        return { error: "There is no game being hosted in this channel." }
      }
      return { game, isPrevious: false }
    }

    const channelId = this.args[0]
    const gameId = this.args[1]

    if (!this.isSnowflake(channelId)) {
      return { error: `Try again with ${this.constructor.argsDescription}` }
    }

    if (gameId && !this.isNumericId(gameId)) {
      return { error: `Try again with ${this.constructor.argsDescription}` }
    }

    if (gameId) {
      const oldStatus = new OldStatusCommand(
        this.message,
        channelId,
        this.serverId,
        gameId
      )
      await oldStatus.prepare()
      if (!oldStatus.game) {
        return { error: "No previous game was found with those ids." }
      }
      return { game: oldStatus.game, isPrevious: true }
    }

    const status = new ChannelStatusCommand(
      this.message,
      channelId,
      this.serverId
    )
    await status.prepare()
    if (!status.game) {
      return { error: "There is no game being hosted in that channel." }
    }
    return { game: status.game, isPrevious: false }
  }

  makeExportText(game) {
    const lines = []
    lines.push(`Game: ${game.name}`)
    lines.push(`Channel ID: ${game.channel}`)
    lines.push(`Master: ${game.masterUsername} (${game.masterId})`)
    lines.push(`Started At: ${this.formatDate(game.startedAt)}`)
    if (game.endedAt) {
      lines.push(`Ended At: ${this.formatDate(game.endedAt)}`)
    }
    lines.push("")

    const mups = game.getMups().filter(Boolean)
    if (!mups.length) {
      lines.push("(No MUP links)")
      return lines.join("\n") + "\n"
    }

    for (let i = 0; i < mups.length; i++) {
      lines.push(mups[i])
    }

    return lines.join("\n") + "\n"
  }

  formatDate(timestamp) {
    if (!timestamp) return ""
    return new Date(timestamp).toISOString()
  }

  makeFilename(game, isPrevious) {
    const safeName = this.cleanFilename(game.name || "game")
    const kind = isPrevious ? "previous" : "current"
    return `${safeName}-${game.channel}-${game.startedAt}-${kind}-mups.txt`
  }

  cleanFilename(text) {
    return (
      String(text)
        .replace(/[^a-z0-9-_]+/gi, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 80) || "game"
    )
  }

  isSnowflake(value) {
    return /^\d{17,20}$/.test(value)
  }

  isNumericId(value) {
    return /^\d+$/.test(value)
  }
}
