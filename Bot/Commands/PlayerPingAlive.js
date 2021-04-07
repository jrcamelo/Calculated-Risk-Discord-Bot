const PlayerPingCommand = require("./PlayerPing.js");

class PlayerPingAliveCommand extends PlayerPingCommand {
  static command = ["PingAlive", "Alive"];
  static helpTitle = "Pings players that are alive.";

  async ping() {
    return await this.sendReply(this.getTurn().pingAlive());
  }

}
module.exports = PlayerPingAliveCommand;