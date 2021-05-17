const emotes = require("../utils/emotes")
const Database = require("../database")

module.exports = class BaseCommand {
  // Command settings
  static description = "Description not set"
  static options = []
  static aliases = ["base"]
  static name = this.aliases[0]
  static data() { 
    return {
      name: this.name, 
      description: this.description, 
      options: this.options
    }
  }
  // Restrictions
  needGame = false
  masterOnly = false
  acceptModerators = true
  playerOnly = false
  aliveOnly = false
  // Database
  getsGame = true
  // Deletion
  canDelete = true
  limitDelete = false
  // Reply options
  ephemeral = false
  canMention = false

  constructor(message, interaction, args) {
    this.interaction = interaction
    if (this.interaction != null)
      return this.setup()
    
    this.message = message
    if (this.message != null)
      return this.setupMessage()
  }

  setup() {
    this.user = this.interaction.user
    this.database = new Database(this.interaction.channel)
    if (this.getsGame) this.game = this.database.getGame()
    if (this.game != null) this.turn = this.game.turn
    if (this.turn != null) 
      this.player = this.turn.getPlayer(this.user)
    this.loadOptions()
  }
  // ! Message
  setupMessage() {
    this.user = this.message.author
    this.database = new Database(this.message.channel)
    if (this.getsGame) this.game = this.database.getGame()
    if (this.game != null) this.turn = this.game.turn
    if (this.turn != null) 
      this.player = this.turn.getPlayer(this.user)
    this.limitDelete = this.message.limitDelete      
    this.parseMessageOptions()
    this.doSendReply = this.doSendReplyMessage
    this.replyEphemeral = this.replyDeletable
  }

  async tryExecute() {
    const validationError = await this.validate()
    if (validationError) {
      return this.replyEphemeral(validationError)
    }

    try {
      return this.execute()
    } catch(e) {
      console.log(e)
    }
  }

  async validate() {
    if (this.needGame && this.game == null)
      return "There is no game being hosted in this channel."
    if (this.masterOnly)
      if (this.isMaster() || (this.acceptModerators && this.isModerator()))
        return "You are not allowed to use this command."
    if (this.playerOnly && this.player == null)
      return "You are not playing this game."
    if (this.player != null && this.aliveOnly && this.player.alive == false)
      return "You are dead."
    if (this.game && this.turn == null)
      return "Something went wrong and the current turn was not found."
  }

  async execute() {
    return this.replyEphemeral("This command is blank for some reason.")
  }

  loadOptions() {
    this.options = {}
    this.interaction.options.forEach(option => {
      this.options[option.name] = option.value
    })
  }
  // TODO
  // ! Message
  parseMessageOptions() {
    this.options = {}
  }

/* -------------------------------------------------------------------------- */
/*                                   Replies                                  */
/* -------------------------------------------------------------------------- */

  async sendReply(content, overrideDeletable = false) {
    if (this.ephemeral) return this.replyEphemeral(content)
    const options = {}
    if (!this.canMention) options.allowedMentions = { parse: [] }
    this.reply = await this.doSendReply(content, options)
    await this.afterReply({ overrideDeletable })
    return this.reply
  }
  async replyDeletable(content) {
    return this.sendReply(content, true)
  }

  async replyEphemeral(content) {
    this.reply = await this.interaction.sendReply(content, {ephemeral: true})
    return this.reply
  }

  async doSendReply(content, options) {
    this.interaction.doSendReply(content, options)
  }
  // ! Message
  async doSendReplyMessage(content, options) {
    this.message.channel.send(content, options)
  }

  async afterReply(options) {
    if (this.canDelete || options.overrideDeletable) {
      await this.addDeleteReaction()
    }
  }

/* -------------------------------------------------------------------------- */
/*                                  Reactions                                 */
/* -------------------------------------------------------------------------- */

  prepareToListenForReactions() {
    this.reactions = {}
    this.reactionFilter = (reaction, user) => {
      return this.reactions[reaction.emoji.name] != null;
    };
  }

  async waitReplyReaction() {
    const options = { max: 1, time: 30000, errors: ['time'] };
    this.reply.awaitReactions(this.reactionFilter, options)
      .then(collected => {
          this.reactions[collected.first().emoji](collected.first(), this); 
      })
      .catch(collected => {
          this.reply.reactions.removeAll();
      });
  }

  async addDeleteReaction() {
    if (this.reply == null) return
    await this.reply.react(emotes.deleteReactionEmoji);
    this.reactions[emotes.deleteReactionEmoji] = this.deleteReply;
  }

  async deleteReply(collected, command) {
    if (command.limitDelete) 
      if (!collected.users.cache.has(command.game.master.id))
        return await command.waitReplyReaction();
    return await collected.message.delete();
  }

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

/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */

  isMaster() {
    if (this.game == null) return true
    return this.user.id == this.game.master.id;
  }

  isModerator() {
    if (this.interaction) {
      // TODO: Get user permissions on interaction
      return true
    } else {
      const member = this.message.channel.guild.members.cache.get(this.user.id);
      return !member.hasPermission(['MANAGE_MESSAGES']) && this.user.id != "464911746088304650" 
    }
  }
}