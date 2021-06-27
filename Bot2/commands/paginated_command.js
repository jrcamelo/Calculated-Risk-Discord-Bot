const emotes = require("../utils/emotes")
const BaseCommand = require("./base_command")

module.exports = class PaginatedCommand extends BaseCommand {
  shouldLoop = true
  index = 1
  floor = 0
  ceiling = 1

  constructor(message, args) {
    super(message, args)
  }

  // Override
  async getReply() {
    return "This paginated command is blank for some reason"
  }

  async editReply() {
    await this.reply.edit(this.getReply());
    await this.addPageReactions();
  }

  async addPageReactions() {
    await this.addPrevious();
    await this.addNext();
    await this.waitReplyReaction();
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

  shouldAddNext() {
    return this.shouldLoop || this.index < this.ceiling
  }

  shouldAddPrevious() {
    return this.shouldLoop || this.index > this.floor
  }

  async nextPage(_collected, command) {
    command.index += 1;
    if (command.shouldLoop && command.index > command.ceiling) {
      command.index = command.floor
    }
    await command.editReply();
  }

  async previousPage(_collected, command) {
    command.index -= 1;
    if (command.shouldLoop && command.index < command.floor) {
      command.index = command.ceiling
    }
    await command.editReply();
  }

  // Reactions
  async addNextReactionToReply(callback) {
    if (this.reply != null) {
      await this.reply.react(emotes.nextReactionEmoji);
      this.reactions[emotes.nextReactionEmoji] = callback;
    }
  }

  async addPreviousReactionToReply(callback) {
    if (this.reply != null) {
      await this.reply.react(emotes.previousReactionEmoji);
      this.reactions[emotes.previousReactionEmoji] = callback;
    }
  }

  cancelNextReactionToReply() {
    delete this.reactions[emotes.nextReactionEmoji];
  }

  cancelPreviousReactionToReply() {
    delete this.reactions[emotes.previousReactionEmoji]
  }

}