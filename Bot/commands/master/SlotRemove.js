const BaseCommand = require("../base_command")

module.exports = class SlotRemoveCommand extends BaseCommand {
  static aliases = ["FactionRemove", "FRemove", "SlotRemove"]
  static description = "Removes a faction slot. Accepts |"
  static argsDescription = "<Faction> | <Faction>"
  static category = "Master"

  canDelete = false
  masterOnly = true
  needsGame = true
  neededArgsAmount = 1
  
  async execute() {
    let resultMessage = ""
    for (const faction of this.splitArgWithPipes()) {
      const existingFaction = this.turn.getFaction(faction)
      if (existingFaction) {
        resultMessage += `**${existingFaction}** was removed.\n`
      } else {
        resultMessage += `**${faction}** was not found.\n`
      }
    }

    if (this.saveOrReturnWarning()) return
    return this.sendReply(resultMessage)
  }
}