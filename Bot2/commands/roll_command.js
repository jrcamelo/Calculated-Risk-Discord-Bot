const BaseCommand = require("./base_command")
const RollPresenter = require("../presenters/roll_presenter")

module.exports = class BaseRollCommand extends BaseCommand {
  canDelete = false
  needsGame = true
  playerOnly = true
  aliveOnly = true
  canMention = true

  isTest = false
  isRanked = true

  static MULTIPLE_ROLL_LIMIT = 10

  prepare() {
    super.prepare()
    this.setGameAndTurn()
  }

  setGameAndTurn() {
    if (this.isTest) return
    if (this.game != null) {
      this.gameTime = this.game.startedAt
      this.turnNumber = this.game.turnNumber
    }
  }    

  addAttachmentToIntention() {
    if (this.attachment) {
      if (!this.arg)
        this.arg = "{Attachment}"
      else
        this.arg += " {Attachment}"
    }
  }

  saveRollOrReturnWarning() {
    this.turn.addRoll(this.roll)
    return this.saveOrReturnWarning()
  }

  saveMultipleRollsOrReturnWarning() {
    for (const roll of this.rolls) {
      this.turn.addRoll(roll)
    }
    return this.saveOrReturnWarning()
  }

  sendWarningOnInvalidLimit() {
    if (!this.isValidNumber(this.limit)) {
      this.replyDeletable("<Limit> is not a valid number.")
      return true
    } else if (this.limit > 100000000000) {
      this.replyDeletable("<Limit> is too big, try rolling lower than 10¹¹.")
      return true
    }
    return false
  }

  sendWarningOnInvalidMultiple() {
    if (!this.isValidNumber(this.multiple)) {
      this.replyDeletable("<Multiple> is not a valid number.")
      return true
    } else if (this.multiple > BaseRollCommand.MULTIPLE_ROLL_LIMIT) {
      this.replyDeletable(`Too many rolls, <Multiple> has to be lower than ${BaseRollCommand.MULTIPLE_ROLL_LIMIT}.`)
      return true
    }
    return false
  }

  isValidNumber(number) {
    if (isNaN(+number)) {
      return false
    } else if (number <= 0) {
      return false
    }
    return true
  }

  async sendRollResult() {
    return await this.sendSingleRollResult()
  }

  async sendSingleRollResult() {
    let masterId = this.game ? this.game.masterId : null
    if (this.isTest) masterId = null
    let text = (new RollPresenter(this.roll)).describeJustRolled(masterId)
    if (!this.isTest && this.turn && this.turn.everyoneHasRolled()) {
      text += "\n\n**All players have rolled this turn!**"
    }
    return await this.sendReply(text)
  }

  async sendMultipleRollResult() {
    let masterId = this.game ? this.game.masterId : null
    if (this.isTest) masterId = null
    let text = (new RollPresenter(null, this.rolls)).describeMultipleJustRolled(masterId)
    if (!this.isTest && this.turn && this.turn.everyoneHasRolled()) {
      text += "\n\n**All players have rolled this turn!**"
    }
    return await this.sendReply(text)
  }
}