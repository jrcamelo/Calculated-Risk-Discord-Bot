const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")
const Discord = require('discord.js');

module.exports = class StatusCommand extends PaginatedCommand {
  static aliases = ["Status", "Game"]
  static description = "Shows the status of the current game. Try `S` or `G` for a shorter version."
  static argsDescription = "[Turn]"
  static category = "Game"

  canDelete = true
  needsGame = true
  isExpanded = true
  hasExtras = true

  async execute() {
    this.index = this.game.turnNumber
    this.ceiling = this.game.turnNumber

    this.getPageArg()

    this.gamePresenter = new GamePresenter(this.game)

    const reply = this.getReply()
    if (Array.isArray(reply)) {
      const last = reply.length - 1
      for (let i = 0; i < reply.length; i++) {
        const embed = reply[i]
        if (i === last) await this.sendReply(embed)
        else await this.doSendReply(embed)
      }
    } else {
      await this.sendReply(reply)
    }
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
}