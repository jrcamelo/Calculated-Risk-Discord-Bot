const emotes = require("../utils/emotes")
const BaseCommand = require("./base_command")

module.exports = class PaginatedCommand extends BaseCommand {
  shouldLoop = true
  hasExpand = false
  isExpanded = false
  hasExtras = false
  isShowingExtras = false

  index = 1
  floor = 0
  ceiling = 1
  step = 1

  constructor(message, args) {
    super(message, args)
  }

  getPageArg() {
    if (this.arg && !isNaN(this.arg)) {
      if (this.arg > this.floor && this.arg <= this.ceiling) {
        this.index = +this.arg
      }
    }
  }

  // Override
  async getReply() {
    return "This paginated command is blank for some reason"
  }

  async editReply() {
    await this.reply.edit(this.makeReplyPayload(await this.getReply()));
    await this.afterEdit()
  }

  makeReplyPayload(reply) {
    if (!Array.isArray(reply)) return reply
    return { embeds: reply.slice(0, 10) }
  }

  async afterReply(options = {}) {
    this.prepareToListenForReactions()
    await this.beforeSlashControls()
    if (this.canDelete || options.overrideDeletable) {
      await this.addDeleteReaction()
    }
    await this.addPageReactions()
    if (this.reactions && Object.keys(this.reactions).length) {
      if (this.message._isSlashCommand) return this.updateSlashControls()
      await this.waitReplyReaction()
    }
  }

  async afterEdit() {
    await this.beforeSlashControls()
    this.addDeleteReaction()
    this.addPageReactions()
    if (this.message._isSlashCommand) return this.updateSlashControls()
    await this.waitReplyReaction()
  }

  async addPageReactions() {
    if (!this.valid) return
    this.addPrevious();
    this.addNext();
    this.addExpand();
    this.addExtras();
  }

  async addNext() {
    if (this.shouldAddNext()) {
      await this.addNextReactionToReply(this.nextPage);
    } else {
      this.cancelNextReactionToReply();
    }
  }

  async addPrevious() {
    if (this.shouldAddPrevious()) {
      await this.addPreviousReactionToReply(this.previousPage);
    } else {
      this.cancelPreviousReactionToReply();
    }
  }

  async addExpand() {
    if (this.hasExpand) {
      await this.addExpandReactionToReply(this.doExpand);
    }
  }

  async addExtras() {
    if (this.hasExtras) {
      await this.addExtrasReactionToReply(this.doShowExtras);
    }
  }

  shouldAddNext() {
    return this.shouldLoop || (this.index + this.step) <= this.ceiling
  }

  shouldAddPrevious() {
    return this.shouldLoop || (this.index - this.step) >= this.floor
  }

  async nextPage(_collected, command) {
    command.index += command.step;
    if (command.shouldLoop && command.index > command.ceiling) {
      command.index = command.floor
    }
    await command.editReply();
  }

  async previousPage(_collected, command) {
    command.index -= command.step;
    if (command.shouldLoop && command.index < command.floor) {
      command.index = command.ceiling
    }
    await command.editReply();
  }

  async doExpand(_collected, command) {
    command.isExpanded = !command.isExpanded;
    await command.editReply();
  }

  async doShowExtras(_collected, command) {
    command.isShowingExtras = !command.isShowingExtras;
    await command.editReply();
  }

  getSlashButtonLabel(actionId) {
    if (actionId === "prev") return "◀"
    if (actionId === "next") return "▶"
  }

  // Reactions
  async addNextReactionToReply(callback) {
    if (this.reply != null) {
      await this.addReact(emotes.nextReactionEmoji, callback);
    }
  }

  async addPreviousReactionToReply(callback) {
    if (this.reply != null) {
      await this.addReact(emotes.previousReactionEmoji, callback);
    }
  }

  async addExpandReactionToReply(callback) {
    if (this.reply != null) {
      await this.addReact(emotes.plusReactionEmoji, callback);
    }
  }

  async addExtrasReactionToReply(callback) {
    if (this.reply != null) {
      await this.addReact(emotes.extrasReactionEmoji, callback);
    }
  }

  cancelNextReactionToReply() {
    delete this.reactions[emotes.nextReactionEmoji];
  }

  cancelPreviousReactionToReply() {
    delete this.reactions[emotes.previousReactionEmoji]
  }

}
