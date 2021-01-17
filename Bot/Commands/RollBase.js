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

    await this.reply(this.pingGM() + this.roll.makeReplyText(this.player));
  }

  doRoll() {
    this.roll = this.getTurn().doPlayerRoll(this.message, "NORMAL", this.arg);
  }

  async validate() {
    if (this.thereIsNoGame()) {
        await this.replyWithDelete(`There is currently no game being hosted in this channel. Try r.Test instead.`)
        return true;
    }
    this.loadPlayer();
    if (this.userIsNotPlaying()) {
        await this.replyWithDelete(`You have not joined this game yet. Join with r.claim or roll with r.Test instead.`)
        return true;
    } else {
      if (this.playerIsDead()) {
        await this.replyWithDelete(`You are dead.`)
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