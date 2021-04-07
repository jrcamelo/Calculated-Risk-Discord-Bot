const RollUntrackedCommand = require("./RollUntracked");

class RollUntrackedPizzaRollCommand extends RollUntrackedCommand {
  static command = ["PizzaRoll"];

  doRoll() {
    this.roll = this.fakeTurn.doPlayerRoll(this.message, "TEST", "", 8);
  }
}
module.exports = RollUntrackedPizzaRollCommand;