const StatusCommand = require("./Status")

module.exports = class StatusShorterCommand extends StatusCommand {
  static aliases = ["G"]
  static description = "Shows the status of the current game."
  static argsDescription = "[Turn]"
  static category = "Game"

  canDelete = true
  needsGame = true
  isExpanded = false
  hasExtras = true
}