const BaseCommand = require("./base_command")
const RollPresenter = require("../presenters/roll_presenter")
const SaveRollOnPlayerStatsTask = require('../tasks/server/set/SaveRollOnPlayerStats')
const SaveRollOnServerTask = require('../tasks/server/set/SaveRollOnServer')

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
    this.saveRollStats(this.roll)
    this.turn.addRoll(this.roll)
    return this.saveOrReturnWarning()
  }

  saveMultipleRollsOrReturnWarning() {
    for (const roll of this.rolls) {
      this.saveRollStats(roll)
      this.turn.addRoll(roll)
    }
    return this.saveOrReturnWarning()
  }

  async saveRollStats(roll) {
    if (roll.isTest || !roll.isRanked) return
    new SaveRollOnPlayerStatsTask(this.serverId, this.player, roll, !this.player.rolled).addToQueue()
    new SaveRollOnServerTask(this.serverId, roll).addToQueue()
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

  sendWarningOnInvalidMultiple(maximum=BaseRollCommand.MULTIPLE_ROLL_LIMIT) {
    if (!this.isValidNumber(this.multiple)) {
      this.replyDeletable("<Multiple> is not a valid number.")
      return true
    } else if (this.multiple > maximum) {
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
    await this.sendReply(text)
    console.log(this.roll.emote)
    if (this.roll.emote)
      this.reply.react(this.roll.emote)
    return this.reply
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