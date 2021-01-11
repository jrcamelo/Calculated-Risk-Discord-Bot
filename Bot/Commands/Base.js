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

  joinArgsIntoArg() {
    if (this.isArgsBlank()) {
      this.arg = "";
    } else {
      this.arg = this.args.join(" ");
    }
  }
  
  isArgsBlank() {
    return !this.args || !this.args.length;
  }
  
  getMessageAttachment() {
    if (this.message.attachments.size > 0) {
      return this.message.attachments.values().next().value.url;
    }
    return null;
  }

  prepareToListenForReactions() {    
    this.reactions = {}
    this.reactionFilter = (reaction, user) => {
      console.log(reaction.emoji.name);
      return this.reactions[reaction.emoji.name] != null;
    };
  }

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
  
  async loadChannelFromMessage() {
    // await new Channel().get(this.message.channel) ||
    this.channel =  await new Channel().get(this.message.channel) || new Channel().createNew(this.message.channel);
  }

  loadPlayer() {
    if (this.channel.game != null) {
      this.player = this.channel.game.getPlayer(this.message.author);
    }
  }

  async save() {
    return await this.channel.save();
  }

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
    await this.reply.react(BaseCommand.deleteReactionEmoji);
    this.reactions[BaseCommand.deleteReactionEmoji] = this.deleteReply;
  }

  async deleteReply(collected, _command) {
    collected.message.delete();
  }

  async reply(botMessage, mention=false) {
    this.reply = mention ?
      await this.message.reply(botMessage)
      : await this.message.channel.send(botMessage)
    return this.reply;    
  }

  addCommandFooter(botMessage) {
    if (!botMessage.footer) {
      return { 
        text: `"${this.message.content}" by ${this.message.author.username}`,
        iconURL: User.makeDiscordAvatarUrl(this.message.author) 
      }
    }
    botMessage.footer.text += ` - "${this.message.content}" sent by ${this.message.author.username}`;
    if (!botMessage.footer.iconURL) {
      botMessage.footer.iconURL = User.makeDiscordAvatarUrl(this.message.author);
    }
    return botMessage.footer;    
  }

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
    return !member.hasPermission(['MANAGE_MESSAGES'])
  }

  playerIsDead() {
    if (this.player != null) {
      return this.player.alive == false;
    }
    return false;
  }

  getMentionedUser() {
    if (this.message.mentions && 
        this.message.mentions.users &&
        this.message.mentions.users.size) {
      return this.message.mentions.users.values().next().value;
    }
    return null;
  }
}
module.exports = BaseCommand;