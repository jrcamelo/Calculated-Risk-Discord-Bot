const BaseCommand = require("./Base.js");

class RollBaseCommand extends BaseCommand {
  static command = ["Roll"];
  static helpTitle = "State your intention and put your life on Fate's hands.";
  static helpDescription = `${BaseCommand.prefix + this.command[0]} [Intention]`;

  async execute() {
    const error = this.validate();
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
    return this.reply(this.roll.makeText(this.player));
  }

  doRoll() {
    this.roll = this.getTurn().doPlayerRoll(this.message, "NORMAL", this.arg);
  }

  validate() {
    if (this.thereIsNoGame()) {
        return this.reply(`There is currently no game being hosted in this channel.`)
    }
    this.loadPlayer();
    if (this.userIsNotPlaying()) {
        return this.reply(`You have not joined this game yet.`)
    } else {
      if (this.playerIsDead()) {
        return this.reply(`You are dead.`)
      }
    }

    return this.validateArgs();
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