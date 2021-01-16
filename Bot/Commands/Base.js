const Bot = require("../Bot");
const Channel = require("../Models/Channel")

class BaseCommand {
  static prefix = "r.";
  static command = ["Command to be used"];
  static helpTitle = "BaseCommand";
  static helpDescription = "Command to be extended";

  static deleteReactionEmoji = "💥";
  static previousReactionEmoji = "⬅️";
  static nextReactionEmoji = "➡️";
  static fReactionEmoji = "🇫";
  static plusReactionEmoji = "➕";

  static isRequestedCommand(userCommand) {
    for (let commandInput of this.command) {
      if (userCommand.toLowerCase() == commandInput.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  // Setup

  constructor(message, args, userCommand) {
    this.message = message;
    this.args = args;
    this.userCommand = userCommand;

    this.loadBotAndDatabase();
    this.joinArgsIntoArg();
    this.prepareToListenForReactions();
  }


  loadBotAndDatabase() {
    this.client = Bot.client;
    this.db = Bot.db;
  }

  async loadChannelFromMessage() {
    this.channel =  await new Channel().get(this.message.channel) || new Channel().createNew(this.message.channel);
  }

  loadPlayer() {
    if (this.channel.game != null) {
      this.player = this.channel.getPlayer(this.message.author);
    }
  }
  
  joinArgsIntoArg() {
    if (this.isArgsBlank()) {
      this.arg = "";
    } else {
      this.arg = this.args.join(" ");
    }
  }

  prepareToListenForReactions() {    
    this.reactions = {}
    this.reactionFilter = (reaction, user) => {
      console.log(reaction.emoji.name);
      return this.reactions[reaction.emoji.name] != null;
    };
  }

  // Discord Execution

  async tryExecute() {
    await this.loadChannelFromMessage();
    this.message.channel.startTyping();
    try {
      await this.execute();
      this.message.channel.stopTyping();
    } catch(e) {
      console.log("\n" + this.message.content + " caused an error at " + new Date())
      console.log(e);
      console.log("\n")
      this.message.channel.stopTyping();
    }
  }
  
  async execute() {
    console.log("Invalid command: " + this.message.content);
  }

  async save() {
    return await this.channel.save();
  }

  async reply(botMessage, mention=false) {
    this.reply = mention ?
      await this.message.reply(botMessage)
      : await this.message.channel.send(botMessage)
    return this.reply;    
  }

  // Discord Reactions

  async waitReplyReaction() {
    const options = { max: 1, time: 120000, errors: ['time'] };
    this.reply.awaitReactions(this.reactionFilter, options)
      .then(collected => {
          this.reactions[collected.first().emoji](collected.first(), this); 
      })
      .catch(collected => {
          this.reply.reactions.removeAll();
      });
  }

  async addDeleteReactionToReply() {
    if (this.reply != null) {
      await this.reply.react(BaseCommand.deleteReactionEmoji);
      this.reactions[BaseCommand.deleteReactionEmoji] = this.deleteReply;
    }
  }

  async deleteReply(collected, _command) {
    collected.message.delete();
  }
  
  async addNextReactionToReply(callback) {
    if (this.reply != null) {
      await this.reply.react(BaseCommand.nextReactionEmoji);
      this.reactions[BaseCommand.nextReactionEmoji] = callback;
    }
  }

  async addPreviousReactionToReply(callback) {
    if (this.reply != null) {
      await this.reply.react(BaseCommand.previousReactionEmoji);
      this.reactions[BaseCommand.previousReactionEmoji] = callback;
    }
  }

  cancelNextReactionToReply() {
    delete this.reactions[BaseCommand.nextReactionEmoji];
  }

  cancelPreviousReactionToReply() {
    delete this.reactions[BaseCommand.previousReactionEmoji]
  }

  // Validation

  thereIsNoGame() {
    return this.channel.game == null;
  }

  userIsNotPlaying() {
    return this.player == null;
  }

  userIsNotMaster() {
    return this.channel.game.master.id != this.message.author.id;
  }

  userIsNotMod() {
    const id = this.message.author.id;
    const member = this.message.channel.guild.members.cache.get(id);
    return !member.hasPermission(['MANAGE_MESSAGES']) && this.message.author.id != "464911746088304650" 
  }

  playerIsDead() {
    if (this.player != null) {
      return this.player.alive == false;
    }
    return false;
  }
  
  isArgsBlank() {
    return !this.args || !this.args.length;
  }

  // Discord Utils

  getMentionedUser() {
    if (this.message.mentions && 
        this.message.mentions.users &&
        this.message.mentions.users.size) {
      return this.message.mentions.users.values().next().value;
    }
    return null;
  }
  
  getMessageAttachment() {
    if (this.message.attachments.size > 0) {
      return this.message.attachments.values().next().value.url;
    }
    return null;
  }

  // Utils

  getGame() {
    if (this.channel != null) {
      return this.channel.game;
    }
  }

  getTurn(index=null) {
    if (this.channel != null) {
      return this.channel.getTurn(index);
    }
  }
}
module.exports = BaseCommand;