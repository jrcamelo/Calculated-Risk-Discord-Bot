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
  
    let embed = this.gamePresenter.makeStatusEmbed(this.index, this.isExpanded)
    if (embed.length > 4096)
      embed = this.gamePresenter.makeStatusEmbed(this.index, false)
  
    return this.chunkEmbeds(embed)
  }
  
  chunkEmbeds(embed) {
    if (Array.isArray(embed)) return embed
  
    const embeds = []
    const desc = embed.description ?? ""
    const limit = 3800
  
    if (desc.length <= limit) return [embed]
  
    const lines = desc.split("\n")
    let current = ""
  
    for (const line of lines) {
      if ((current + line + "\n").length > limit) {
        const clone = new Discord.MessageEmbed(embed)
          .setDescription(current.trim())
        if (embeds.length > 0) clone.setTitle(`${embed.title || ""} (cont.)`)
        embeds.push(clone)
        current = ""
      }
      current += line + "\n"
    }
  
    if (current.trim()) {
      const clone = new Discord.MessageEmbed(embed)
        .setDescription(current.trim())
      if (embeds.length > 0) clone.setTitle(`${embed.title || ""} (cont.)`)
      clone.setFooter(embed.footer?.text)
  
      clone.setImage(embed.thumbnail?.url ?? null)
      clone.setThumbnail(null)
      embeds.push(clone)
    }
  
    return embeds
  }

  getSlashButtonLabel(actionId) {
    if (actionId === "expand") return this.isExpanded ? "Compact" : "Full Status"
    if (actionId === "extras") return this.isShowingExtras ? "Less Info" : "More Info"
    return super.getSlashButtonLabel(actionId)
  }
}
