const RollIdCommand = require("./RollId")

module.exports = class TestRollIdCommand extends RollIdCommand {
  static aliases = ["TestRollId", "TestId", "TID"]
  needsGame = false
  playerOnly = false
  canDelete = true
  
  isTest = true
  
  saveRollOrReturnWarning() {}
}