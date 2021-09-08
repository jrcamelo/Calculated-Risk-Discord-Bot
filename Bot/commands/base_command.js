const emotes = require("../utils/emotes")
const discordUtils = require("../utils/discord")
const Database = require("../database")
const { MessageEmbed } = require("discord.js")

module.exports = class BaseCommand {
  // Command Settings
  static aliases = ["base"]
  static name = this.constructor.aliases ? this.constructor.aliases[0] : 'base?'
  static description = "Description not set"
  static argsDescription = ""
  static makeUsage(prefix) { return `${prefix}${this.constructor.name} ${this.constructor.argsDescription}` }

  // Restrictions
  needsGame = false
  masterOnly = false
  acceptModerators = true
  acceptAdmins = true
  playerOnly = false
  aliveOnly = false
  // Args
  neededArgsAmount = 0
  needsMention = false
  needsMentionedPlayer = false
  needsAttachment = false
  acceptsPlayerNotInServer = false
  shouldCleanArgsLineBreaks = true
  ignoreFirstArg = false
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
    this.limitDelete = this.message.limitDelete
  }

  prepare() {
    this.prepareData()
    this.prepareArgs()
    if (this.shouldCleanArgsLineBreaks)
      this.cleanArgsLineBreaks()
  }

  prepareData() {    
    this.user = this.message.author
    this.server = this.message.channel.guild
    this.serverId = this.server.id
    this.channel = this.message.channel
    this.database = new Database(this.channel)
    if (this.getsGame) this.game = this.database.getGame()
    if (this.game != null) this.turn = this.game._turn
    if (this.turn != null) this.player = this.turn.getPlayer(this.user)
  }

  prepareArgs() {
    this.mentionedUser = this.getMentionedUser()
    if (this.mentionedUser && this.turn)
      this.mentionedPlayer = this.turn.getPlayer(this.mentionedUser)
    this.attachment = this.getMessageAttachment()
    if (this.ignoreFirstArg) 
      this.args.shift();
    this.joinArgsIntoArg()
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
    const previousShouldLoop = this.shouldLoop
    this.shouldLoop = false
    this.valid = false
    if (this.needsGame && this.game == null)
      return "There is no game being hosted in this channel."
    if (this.masterOnly)
      if (!this.isMaster() 
          || (this.acceptModerators && !this.isModerator())
          || (this.acceptAdmins && !this.isAdmin()))
        return "You are not allowed to use this command."
    if (this.playerOnly && this.player == null)
      return "You are not playing this game."
    if (this.playerOnly && this.aliveOnly && this.player.alive == false)
      return "You are dead."
    if (this.game && this.turn == null)
      return "Something went wrong and the current turn was not found."

    if (this.args.length < this.neededArgsAmount)
      return `Try again with ${this.constructor.argsDescription}`
    if (this.needsAttachment && !this.attachment)
      return "You need to attach an image."
    if (this.needsMention && !this.mentionedUser)
      return "You need to mention a user."
    if (this.needsMentionedPlayer && !this.mentionedPlayer)
      return "That user is not playing this game."
    this.valid = true
    this.shouldLoop = previousShouldLoop
  }

  isArgsBlank() {
    return this.args == null || !this.args.length
  }

  // Need to override
  async execute() {
    return this.replyEphemeral("This command is blank for some reason.")
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
    this.sendReply(content, true)
  }

  async replyEphemeral(content) {
    this.ephemeral = true
    this.limitDelete = false
    this.replyDeletable(content)
  }

  async doSendReply(content, options) {
    if (content instanceof MessageEmbed) {
      return this.message.channel.send(content)
    } else {
      return this.message.channel.send(content, options)
    }
  }

  async afterReply(options) {
    this.prepareToListenForReactions()
    if (this.canDelete || (options && options.overrideDeletable)) {
      await this.addDeleteReaction()
    }
    if (this.reactions && Object.keys(this.reactions).length) {
      this.waitReplyReaction()
    }
  }

  async sendImageMessage(image) {
    const options = {
      files: [image]
    }
    this.reply = await this.doSendReply("", options)
    await this.afterReply()
    return this.reply
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
    const time = this.ephemeral ? 30000 : 60000
    const options = { max: 1, time, errors: ['time'] };
    this.reply.awaitReactions(this.reactionFilter, options)
      .then(collected => {
        this.reactions[collected.first().emoji](collected.first(), this); 
      })
      .catch(collected => {
        if (this.ephemeral) {
          this.reply.delete()
        } else {
          this.reply.reactions.removeAll();
        }
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
    return this.user.id == this.game.masterId;
  }

  isModerator() {
    return this.hasPermissions('MANAGE_MESSAGES');
  }

  isAdmin() {
    return this.hasPermissions('ADMINISTRATOR');
  }

  hasPermissions(permission) {
    const member = this.message.channel.guild.members.cache.get(this.user.id);
    return member.permissions.has(permission) || this.user.id == process.env.OWNER;
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Utils                                   */
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
      return this.replyEphemeral("There was an error while saving this game.")
    }
    return false
  }

  takeFirstArg() {
    const firstArg = this.args.shift()
    this.joinArgsIntoArg()
    return firstArg
  }

  joinArgsIntoArg() {
    if (this.isArgsBlank()) {
      this.arg = "";
    } else {
      this.arg = this.args.join(" ");
    }
  }
  
  cleanArgsLineBreaks() {
    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i]
      this.args[i] = this.cleanLineBreak(arg)
    }
    this.arg = this.cleanLineBreak(this.arg)
  }

  cleanLineBreak(text) {
    if (!text) return text
    return text.replace(/(\r\n|\n|\r)/gm, "");
  }

  // Discord Utils

  getMentionedUser() {
    const user = discordUtils.getMentionedUser(this.message)
    if (user) return user

    if (this.acceptsPlayerNotInServer && this.turn != null) {
      return this.turn.getPlayer({id: this.args})
    }
    return null;
  }

  getMentionedUsers() {
    console.log(discordUtils.getMentionedUsers(this.message))
    return discordUtils.getMentionedUsers(this.message)
  }

  getMentionedUsersAsHash() {
    const users = discordUtils.getMentionedUsers(this.message)
    const hash = {}
    users.forEach(user => {
      hash[user.id] = user
    })
    return hash
  }
  
  getMessageAttachment() {
    if (this.message.attachments.size > 0) {
      return this.message.attachments.values().next().value.url;
    }
    return null;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Multiple                                  */
  /* -------------------------------------------------------------------------- */ 

  splitArgWithPipes() {
    const multipleArgs = this.arg.split("|")
    return multipleArgs.map(arg => { return arg.trim() })
  }

  getMultipleMentionsAndArgs() {
    const multiple = []
    for (let arg of this.splitArgWithPipes()) {
      const mentionAndArg = discordUtils.getMentionAndArg(arg)
      if (!mentionAndArg) continue
      multiple.push(mentionAndArg)
    }
    return multiple
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Database                                  */
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
      return this.replyEphemeral("There was an error while saving this game.")
    }
    return false
  }

}