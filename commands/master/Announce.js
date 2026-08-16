const BaseCommand = require("../base_command")
const { makeMessageLink } = require("../../utils/discord")
module.exports = class PlayerAnnounceCommand extends BaseCommand {
  static aliases = ["Announce", "Proclaim", "An"]
  static description = "Add something to the history. (Aliases: Proclaim, An)"
  static argsDescription = "<Message> {Attachment}"
  static category = "Master"

  canDelete = false
  needsGame = true
  masterOnly = true
  canMention = false
  shouldCleanArgsLineBreaks = false

  async validate() {
    const validationError = await super.validate()
    if (validationError) return validationError
    if (!this.arg && !this.attachment) return `Try again with ${this.constructor.argsDescription}`
  }

  async execute() {
    await this.saveSlashAttachmentToUploads()
    const text = `<@!${this.game.masterId}> — ${this.makeMessageText()}`
    await this.sendReply(this.makeReplyPayload(text))
    this.turn.saveAddendum({id: this.game.masterId}, this.makeHistoryText(text))
    if (this.saveOrReturnWarning()) return
  }

  makeMessageText() {
    const message = this.arg || "{Attachment}"
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
