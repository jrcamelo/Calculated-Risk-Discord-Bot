const BaseCommand = require("../base_command")
const PlayerCardPresenter = require("../../presenters/player_card_presenter")

module.exports = class ProfileCommand extends BaseCommand {
  static aliases = ["Profile", "Rank", "Level"]
  static description = "Shows your profile card with stats."
  static argsDescription = "[@User]"
  static category = "Player"

  canDelete = true
  getsGame = false

  async execute() {
    let userId = this.user.id
    if (this.mentionedUser) {
      userId = this.mentionedUser.id
    } else if (this.arg && !Number.isNaN(this.arg)) {
      userId = this.arg
    }

    const presenter = new PlayerCardPresenter(this.server, this.serverId, userId)
    if (!await presenter.getPlayerStats()) {
      return this.replyDeletable("User is not a player.")
    }
    if (!await presenter.getDiscordUser(this.server)) {
      return this.replyDeletable("User not found.")
    }
    try {
      const card = await presenter.makeCard()
      if (!card) return this.replyDeletable("Error generating image.")
      await this.sendImageMessage(card)
    } finally {
      presenter.deleteImage()
    }
  }
}