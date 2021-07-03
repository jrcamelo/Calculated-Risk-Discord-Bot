const emotes = require("../utils/emotes")
const Database = require("../database")

module.exports = class BaseCommand {
  // Command Settings
  static aliases = ["base"]
  static name = this.aliases[0]
  static description = "Description not set"
  static argsDescription = ""
  static makeUsage(prefix) { return `${prefix}${this.name} ${this.argsDescription}` }

  // Restrictions
  needsGame = false
  masterOnly = false
  acceptModerators = true
  acceptAdmins = true
  playerOnly = false
  aliveOnly = false
  // Args
  needsArgs = false
  needsMention = false
  needsMentionedPlayer = false
  needsAttachment = false
  acceptsPlayerNotInServer = false
  shouldCleanArgsLineBreaks = true
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
    this.channel = this.message.channel
    this.database = new Database(this.channel)
    if (this.getsGame) this.game = this.database.getGame()
    if (this.game != null) this.turn = this.game._turn
    if (this.turn != null) this.player = this.turn.getPlayer(this.user)
    this.limitDelete = this.message.limitDelete      
    this.parseMessageOptions()
    this.doSendReply = this.doSendReplyMessage
    this.replyEphemeral = this.replyDeletable
    this.mentionedUser = this.getMentionedUser()
    if (this.mentionedUser && this.turn)
      this.mentionedPlayer = this.turn.getPlayer(this.mentionedUser)
    this.attachment = this.getMessageAttachment()
    if (this.shouldCleanArgsLineBreaks) {
      this.cleanArgsLineBreaks()
    }
    this.args = this.joinArgsIntoArg()
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
    if (this.needsGame && this.game == null)
      return "There is no game being hosted in this channel."
    if (this.masterOnly)
      if (this.isMaster() 
          || (this.acceptModerators && this.isModerator())
          || (this.acceptAdmins && this.isAdmin()))
        return "You are not allowed to use this command."
    if (this.playerOnly && this.player == null)
      return "You are not playing this game."
    if (this.playerOnly && this.aliveOnly && this.player.alive == false)
      return "You are dead."
    if (this.game && this.turn == null)
      return "Something went wrong and the current turn was not found."

    if (this.needsArgs && this.isArgsBlank())
      return `Try again with ${this.argsDescription}`
    if (this.needsAttachment && !this.attachment)
      return "You need to attach an image."
    if (this.needsMention && !this.mentionedUser)
      return "You need to mention a user."
    if (this.needsMentionedPlayer && !this.mentionedPlayer)
      return "User is not in this game."
  }

  isArgsBlank() {
    return this.args == null || !this.args.length
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

  /* -------------------------------------------------------------------------- */
  /*                                    Utils                                  */
  /* -------------------------------------------------------------------------- */ 
  
  save() {
    if (this.game != null) {
      return this.game.save()
    }
    return true
  }

  saveOrReturnWarning() {
    if (!this.save()) {
      console.log("ERROR: Could not save at " + this.message.content)
      return this.replyDeletable("There was an error while saving this game.")
    }
    return false
  }

  joinArgsIntoArg() {
    if (this.isArgsBlank()) {
      this.arg = "";
    } else {
      this.arg = this.args.join(" ");
    }
  }
  
  cleanArgsLineBreaks() {
    if (Array.isArray(this.args)) {
      for (let i = 0; i < this.args.length; i++) {
        const arg = this.args[i]
        this.args[i] = this.cleanLineBreak(arg)
      }
    } else {
      this.args = this.cleanLineBreak(this.args)
    }
  }

  cleanLineBreak(text) {
    return text.replace(/(\r\n|\n|\r)/gm, "");
  }

  // Discord Utils

  getMentionedUser() {
    if (this.message.mentions && 
        this.message.mentions.users &&
        this.message.mentions.users.size) {
      return this.message.mentions.users.values().next().value;
    }
    if (this.acceptsPlayerNotInServer && this.turn) {
      return this.turn.getPlayer({id: this.args})
    }
    return null;
  }
  
  getMessageAttachment() {
    if (this.message.attachments.size > 0) {
      return this.message.attachments.values().next().value.url;
    }
    return null;
  }

}