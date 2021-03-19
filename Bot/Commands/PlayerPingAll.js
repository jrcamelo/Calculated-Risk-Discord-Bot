const PlayerPingCommand = require("./PlayerPing.js");

class PlayerPingAllCommand extends PlayerPingCommand {
  static command = ["PingAll", "All"];
  static helpTitle = "Pings every player.";

  async ping() {
    return await this.sendReply(this.getTurn().pingAll());
  }

}
module.exports = PlayerPingAllCommand;