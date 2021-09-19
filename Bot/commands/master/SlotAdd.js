const BaseCommand = require("../base_command")

module.exports = class SlotAddCommand extends BaseCommand {
  static aliases = ["Faction", "Slot"]
  static description = "Adds a faction slot for players to join as. Remove with `FactionRemove` and `FactionClear`. Accepts multiple factions with |"
  static argsDescription = "<Faction> | <Faction>"
  static category = "Master"

  canDelete = false
  masterOnly = true
  needsGame = true
  neededArgsAmount = 1
  
  async execute() {
    let resultMessage = ""
    for (const faction of this.splitArgWithPipes()) {
      if (!faction) continue
      if (this.turn.factionExists(faction)) {
        resultMessage += `**${faction}** already exists.\n`
        continue
      }
      this.turn.addFaction(faction)
      resultMessage += `**${faction}** was added.\n`
    }

    if (this.saveOrReturnWarning()) return
    return this.sendReply(resultMessage)
  }
}