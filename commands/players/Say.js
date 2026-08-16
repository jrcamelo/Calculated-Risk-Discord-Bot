const BaseCommand = require("../base_command")
const { makeMessageLink } = require("../../utils/discord")
module.exports = class PlayerSayCommand extends BaseCommand {
  static aliases = ["Say"]
  static description = "Add something to the history. Masters can use it as `Announce`"
  static argsDescription = "<Message> {Attachment}"
  static category = "Player"

  canDelete = false
  needsGame = true
  playerOnly = true
  aliveOnly = true
  canMention = false
  shouldCleanArgsLineBreaks = false

  async validate() {
    const validationError = await super.validate()
    if (validationError) return validationError
    if (!this.arg && !this.attachment) return `Try again with ${this.constructor.argsDescription}`
  }

  async execute() {
    await this.saveSlashAttachmentToUploads()
    const text = `${this.player.ping()} adds: ${this.makeMessageText()}`
    await this.sendReply(this.makeReplyPayload(text))
    this.turn.saveAddendum(this.player, this.makeHistoryText(text))
    if (this.saveOrReturnWarning()) return
  }

  makeMessageText() {
    const message = this.arg || "<Attachment>"
    if (!this.message._isSlashCommand && this.attachment) return `${message} ${this.attachment}`
    return message
  }

  makeReplyPayload(text) {
    if (this.message._isSlashCommand && this.attachment) {
      return { content: text, files: [this.attachment] }
    }
    return text
  }

  makeHistoryText(text) {
    const replyMessage = this.reply?.message || this.reply
    if (this.message._isSlashCommand && this.attachment && replyMessage?.id) {
      return `${text} ${makeMessageLink(replyMessage)}`
    }
    return text
  }
}
