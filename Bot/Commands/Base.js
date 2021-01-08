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

  async save() {
    return await this.channel.save();
  }

  async waitReplyReaction() {
    const options = { max: 1, time: 120000, errors: ['time'] };
    this.reply.awaitReactions(this.reactionFilter, options)
      .then(collected => {
          this.reactions[collected.first().emoji](collected.first(), this); 
        })
      .catch(collected => {});
  }

  async deleteReply(collected, _command) {
    console.log(collected)
    collected.message.delete();
  }

  async reply(botMessage, mention=false) {
    if (botMessage && typeof(botMessage) != typeof("")) {
      // botMessage.footer = this.addCommandFooter(botMessage);
      // try { await this.message.delete(); } catch(e) { }
    }
    
    this.reply = mention ?
      await this.message.reply(botMessage)
      : await this.message.channel.send(botMessage)
    await this.waitReplyReaction();
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
}
module.exports = BaseCommand;