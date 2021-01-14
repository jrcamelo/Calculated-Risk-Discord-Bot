const MupCommand = require("./Mup.js");

class MupChangeCommand extends MupCommand {
  static command = ["UpdateMup"];
  static helpTitle = "Updates the current Mup image and description, without changing turn and rolls.";
  static helpDescription = `${this.prefix + this.command[0]} <Description> {Image Attachment}`;

  changeMup(description, attachment) {
    this.getTurn().update(attachment, description);
  }

}
module.exports = MupChangeCommand;