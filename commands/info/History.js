const PaginatedCommand = require("../paginated_command")
const GamePresenter = require("../../presenters/game_presenter")
const HistoryEntry = require("../../models/history_entry")

module.exports = class HistoryCommand extends PaginatedCommand {
  static aliases = ["History", "Events", "E"]
  static description = "Shows most events chronologically. (Aliases: E)"
  static argsDescription = "[Turn|Type|Category]..."
  static category = "Game"

  canDelete = true
  needsGame = true
  hasExtras = true
  isShowingExtras = true
  hasExpand = true
  showBonuses = false

  async execute() {
    const validTypes = new Set(Object.values(HistoryEntry.TYPE).map(s => String(s).toLowerCase()))
    const validCats  = new Set(Object.values(HistoryEntry.CATEGORY).map(s => String(s).toLowerCase()))

    let desiredTurnIndex = null
    const types = new Set()
    const categories = new Set()

    for (const raw of this.args) {
      const t = String(raw).toLowerCase()
      if (/^\d+$/.test(t)) {
        desiredTurnIndex = parseInt(t, 10)
      } else if (validTypes.has(t)) {
        types.add(t)
      } else if (validCats.has(t)) {
        categories.add(t)
      }
    }

    this.index = this.game.turnNumber
    this.ceiling = this.game.turnNumber
    this.getPageArg()
    if (desiredTurnIndex !== null) this.index = desiredTurnIndex

    this.expandIndex = 0
    this.filters = { types, categories }

    this.gamePresenter = new GamePresenter(this.game)
    await this.sendReply(this.getReply())
  }

  getReply() {
    let embed = this.gamePresenter.makeHistoryEmbed(this.index, this.expandIndex, this.isShowingExtras, this.filters, this.showBonuses)
    if (this.isShowingExtras && this.isEmbedTooLong(embed)) {
      this.isShowingExtras = false
      embed = this.gamePresenter.makeHistoryEmbed(this.index, this.expandIndex, this.isShowingExtras, this.filters, this.showBonuses)
    }
    return embed
  }

  isEmbedTooLong(embed) {
    if (!embed) return false
    const titleLength = embed.title ? embed.title.length : 0
    const descriptionLength = embed.description ? embed.description.length : 0
    const footerLength = embed.footer && embed.footer.text ? embed.footer.text.length : 0
    const fieldLength = Array.isArray(embed.fields)
      ? embed.fields.reduce((sum, field) => {
          const nameLength = field && field.name ? field.name.length : 0
          const valueLength = field && field.value ? field.value.length : 0
          return sum + nameLength + valueLength
        }, 0)
      : 0
    return titleLength + descriptionLength + footerLength + fieldLength > 6000
  }

  async doExpand(_collected, command) {
    command.expandIndex = command.expandIndex + 1
    await command.editReply()
  }

  getSlashButtonLabel(actionId) {
    if (actionId === "expand") return "More"
    if (actionId === "extras") return this.isShowingExtras ? "Summaries" : "Full Events"
    return super.getSlashButtonLabel(actionId)
  }
}
