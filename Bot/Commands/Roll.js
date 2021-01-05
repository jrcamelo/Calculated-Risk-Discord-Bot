const BaseCommand = require("./Base.js");

class RollCommand extends BaseCommand {
  static command = "roll";

  constructor(message, args) {
    super(message, args);
    this.tracked = true;
  }

  async execute() {
  }

}
module.exports = RollCommand;