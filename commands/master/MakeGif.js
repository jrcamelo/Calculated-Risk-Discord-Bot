const BaseCommand = require("../base_command")
const GifMaker = require("../../utils/gif")

module.exports = class MakeGifCommand extends BaseCommand {
  static aliases = ["Gif"]
  static description = "Makes a gif of all mups."
  static argsDescription = "[Delay in miliseconds]"
  static category = "Master"

  canDelete = false
  masterOnly = true
  acceptAdmins = true
  acceptModerators = true
  acceptAdmins = true

  needsGame = true

  async execute() {
    if (!this.arg) this.arg = 2000

    if (isNaN(this.arg)) {
      return this.replyDeletable("Delay must be a number.")
    }
    const delay = +this.arg
    if (delay < 100 || delay > 5000) {
      return this.replyDeletable("Delay must be between 100 and 5000.")
    }

    const allTurns = this.game.getMups()
    const mups = allTurns.filter(x => x && x.length > 0)    
    const gifMaker = new GifMaker(this.serverId, this.game.startedAt, mups, delay)
    this.message.react("⌛")
    gifMaker.makeGif(async (gif) => {
      if (!gif) return this.replyDeletable("Could not make gif.")
      await this.sendImageMessage(gif)      
    })
  }
}