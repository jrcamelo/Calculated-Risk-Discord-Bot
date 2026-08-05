const HistoryCommand = require("./History")

module.exports = class HistoryBonusCommand extends HistoryCommand {
  static aliases = ["HistoryBonus", "EventsBonus", "EB"]
  static description = "Shows most events chronologically, with current player bonuses. (Aliases: EventsBonus, EB)"
  static argsDescription = "[Turn|Type|Category]..."
  static category = "Game"

  showBonuses = true
}
