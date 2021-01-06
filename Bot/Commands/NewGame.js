const BaseCommand = require("./Base.js");
const Channel = require("../Models/Channel")

class NewGame extends BaseCommand {
  static command = "newgame";

  constructor(message, args) {
    super(message, args);
  }

  async execute() {
    channel = await Channel().get(this.message.channel)
  }

}
module.exports = RollCommand;