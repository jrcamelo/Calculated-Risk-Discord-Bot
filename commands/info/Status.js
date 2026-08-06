const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")
const Discord = require('../../utils/discord_compat');

module.exports = class StatusCommand extends PaginatedCommand {
  static aliases = ["Status", "Game"]
  static description = "Shows the status of the current game. Try `G` for a shorter version."
  static argsDescription = "[Turn]"
  static category = "Game"

  canDelete = true
  needsGame = true
  hasExpand = true
  isExpanded = true
  hasExtras = true

  async execute() {
    this.index = this.game.turnNumber
    this.ceiling = this.game.turnNumber

    this.getPageArg()

    this.gamePresenter = new GamePresenter(this.game)

    await this.sendReply(this.makeReplyPayload(this.getReply()))
  }

  async editReply() {
    await this.reply.edit(this.makeReplyPayload(this.getReply()))
    await this.afterEdit()
  }

  getReply() {
    if (this.isShowingExtras)
      return this.chunkEmbeds(this.gamePresenter.makeStatusEmbedExtras(this.index, this.isExpanded))
  
    return this.makeStatusEmbeds()
  }

  makeStatusEmbeds() {
    const firstEmbed = this.gamePresenter.makeStatusEmbed(this.index, this.isExpanded, "x")
    const limit = this.descriptionLimitForEmbed(firstEmbed)
    const description = this.bestStatusDescription(limit)
    const parts = this.splitDescription(description, limit)

    return parts.map((part, index) => {
      const embed = this.gamePresenter.makeStatusEmbed(this.index, this.isExpanded, part)
      if (index > 0) {
        this.clearFields(embed)
        this.setContinuationTitle(embed, embed)
      }
      return embed
    })
  }

  bestStatusDescription(limit) {
    const compact = this.gamePresenter.makeStatusDescription(this.index, false)
    if (!this.isExpanded) return compact

    const expanded = this.gamePresenter.makeStatusDescription(this.index, true)
    return expanded.length <= limit ? expanded : compact
  }

  descriptionLimitForEmbed(embed) {
    const overhead = this.embedContentLength(embed) - (embed.description?.length || 0)
    return Math.max(1, Math.min(3800, 6000 - overhead))
  }

  embedContentLength(embed) {
    const fields = embed.fields || []
    const fieldsLength = fields.reduce((total, field) => {
      return total + (field.name?.length || 0) + (field.value?.length || 0)
    }, 0)
    return (embed.title?.length || 0)
      + (embed.description?.length || 0)
      + (embed.footer?.text?.length || 0)
      + fieldsLength
  }
  
  chunkEmbeds(embed) {
    if (Array.isArray(embed)) return embed
  
    const embeds = []
    const desc = embed.description ?? ""
    const limit = 3800
  
    if (desc.length <= limit) return [embed]
  
    for (const part of this.splitDescription(desc, limit)) {
      const clone = new Discord.MessageEmbed(embed).setDescription(part)
      if (embeds.length > 0) this.setContinuationTitle(clone, embed)
      embeds.push(clone)
    }

    const last = embeds[embeds.length - 1]
    if (last) {
      last.setFooter(embed.footer?.text)
      last.setImage(embed.thumbnail?.url ?? null)
      last.setThumbnail(null)
    }
  
    return embeds
  }

  splitDescription(desc, limit) {
    const parts = []
    let current = ""

    for (const line of desc.split("\n")) {
      const chunks = this.splitLongLine(line, limit)
      for (const chunk of chunks) {
        const next = current ? `${current}\n${chunk}` : chunk
        if (next.length > limit) {
          if (current) parts.push(current)
          current = chunk
        } else {
          current = next
        }
      }
    }

    if (current) parts.push(current)
    return parts
  }

  splitLongLine(line, limit) {
    if (line.length <= limit) return [line]

    const chunks = []
    let remaining = line
    while (remaining.length > limit) {
      let index = remaining.lastIndexOf(" ", limit)
      if (index < limit * 0.6) index = limit
      chunks.push(remaining.substring(0, index).trim())
      remaining = remaining.substring(index).trim()
    }
    if (remaining) chunks.push(remaining)
    return chunks
  }

  setContinuationTitle(embed, original) {
    const title = original.title ? `${original.title} (cont.)` : "(cont.)"
    embed.setTitle(title.substring(0, 250))
  }

  clearFields(embed) {
    if (typeof embed.setFields === "function") {
      embed.setFields([])
    } else if (typeof embed.spliceFields === "function") {
      embed.spliceFields(0, embed.fields?.length || 0)
    }
  }

  getSlashButtonLabel(actionId) {
    if (actionId === "expand") return this.isExpanded ? "Compact" : "Full Status"
    if (actionId === "extras") return this.isShowingExtras ? "Less Info" : "More Info"
    return super.getSlashButtonLabel(actionId)
  }
}
