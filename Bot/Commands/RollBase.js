const BaseCommand = require("./Base.js");

class RollBaseCommand extends BaseCommand {
  static command = ["Roll"];
  static helpTitle = "State your intention and put your life on Fate's hands.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} [Intention]`;

  async execute() {
    const error = await this.validate();
    if (error != null) {
      return await error;
    }
    this.getTurn();
    this.addAttachmentToIntention();
    this.doRoll();
    if (this.roll == null) {
      return;
    }
    this.save();

    await this.reply(this.pingGM() + this.roll.makeText(this.player));
  }

  doRoll() {
    this.roll = this.getTurn().doPlayerRoll(this.message, "NORMAL", this.arg);
  }

  async validate() {
    if (this.thereIsNoGame()) {
        await this.reply(`There is currently no game being hosted in this channel. Try r.Test instead.`)
        await this.addDeleteReactionToReply()
        await this.waitReplyReaction()
        return true;
    }
    this.loadPlayer();
    if (this.userIsNotPlaying()) {
        this.reply(`You have not joined this game yet. Join with r.claim or roll with r.Test instead.`)
        await this.addDeleteReactionToReply()
        await this.waitReplyReaction()
        return true;
    } else {
      if (this.playerIsDead()) {
        this.reply(`You are dead.`)
        await this.addDeleteReactionToReply()
        await this.waitReplyReaction()
        return true;
      }
    }

    return this.validateArgs();
  }

  pingGM() {
    return this.getGame().master.ping() + " --- "
  }

  addAttachmentToIntention() {
    if (this.getMessageAttachment() != null) {
      this.arg = `[Attachment] ${this.arg}`;
    }
  }

  validateArgs() {
    return;
  }
}
module.exports = RollBaseCommand;