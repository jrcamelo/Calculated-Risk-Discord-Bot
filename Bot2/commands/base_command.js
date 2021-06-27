const emotes = require("../utils/emotes")
const Database = require("../database")

module.exports = class BaseCommand {
  // Command Settings
  static aliases = ["base"]
  static name = this.aliases[0]
  static description = "Description not set"

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


  constructor(message, args) {
    this.message = message
    this.args = args
    this.user = this.message.author
    this.database = new Database(this.message.channel)
    if (this.getsGame) this.game = this.database.getGame()
    if (this.game != null) this.turn = this.game._turn
    if (this.turn != null) this.player = this.turn.getPlayer(this.user)
    this.limitDelete = this.message.limitDelete      
    this.parseMessageOptions()
    this.doSendReply = this.doSendReplyMessage
    this.replyEphemeral = this.replyDeletable
  }


  async tryExecute() {
    const validationError = await this.validate()
    if (validationError) {
      return this.replyDeletable(validationError)
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
    if (this.playerOnly && this.aliveOnly && this.player.alive == false)
      return "You are dead."
    if (this.game && this.turn == null)
      return "Something went wrong and the current turn was not found."
  }

  // Need to override
  async execute() {
    return this.replyDeletable("This command is blank for some reason.")
  }


/* -------------------------------------------------------------------------- */
/*                                   Replies                                  */
/* -------------------------------------------------------------------------- */ 

  async sendReply(content, overrideDeletable = false) {
    const options = {}
    if (!this.canMention) options.allowedMentions = { parse: [] }
    this.reply = await this.doSendReply(content, options)
    await this.afterReply({ overrideDeletable })
    return this.reply
  }

  async replyDeletable(content) {
    return this.sendReply(content, true)
  }

  async doSendReply(content, options) {
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

  
/* -------------------------------------------------------------------------- */
/*                                Permissions                                 */
/* -------------------------------------------------------------------------- */

  isMaster() {
    if (this.game == null) return true
    return this.user.id == this.game.master.id;
  }

  isModerator() {
    return this.hasPermission(['MANAGE_MESSAGES']);
  }

  isAdmin() {
    return this.hasPermission(['ADMINISTRATOR']);
  }

  hasPermissions(permissions) {
    const member = this.message.channel.guild.members.cache.get(this.user.id);
    return member.hasPermission(permissions) || this.user.id == "464911746088304650";
  }
}