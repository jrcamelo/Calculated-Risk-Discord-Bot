const BaseCommand = require("../base_command")

module.exports = class PlayerBanCommand extends BaseCommand {
  static aliases = ["BanInactive", "PurgeInactive"]
  static description = "Removes all players that are not currently in the server."
  static category = "Master"

  canDelete = false
  masterOnly = true
  acceptAdmins = true
  acceptModerators = true
  acceptAdmins = true

  needsGame = true

  canMention = true

  async execute() {

    let playerIds = this.turn.getAllPlayerIds();
    let users = await this.server.members.fetch({ user: playerIds });
    let notInServer = playerIds.filter(id => !users.has(id));

    let message = ""
    for (let id of notInServer) {
      let playerNotInServer = this.turn._players[id]
      if (!playerNotInServer) continue;
      this.turn.banPlayer(playerNotInServer)
      message += `${playerNotInServer.ping()} has been removed.\n`;
    }

    if (this.saveOrReturnWarning()) return;
    this.sendReply(message ? message : "No inactive players found.");
  }
}