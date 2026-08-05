const RollMultipleCommand = require("./RollMultiple")
const BaseRollCommand = require("../roll_command")

module.exports = class TestRollMultipleCommand extends RollMultipleCommand {
  static aliases = ["TestRollX", "TestX", "TX"]
  static description = `Do multiple rolls. No more than ${BaseRollCommand.MULTIPLE_ROLL_LIMIT}. (Aliases: TestX, TX)`
  needsGame = false
  playerOnly = false
  canDelete = true
  
  isTest = true
  
  saveMultipleRollsOrReturnWarning() {}
}
