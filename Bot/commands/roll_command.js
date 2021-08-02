const BaseCommand = require("./base_command")
const RollPresenter = require("../presenters/roll_presenter")
const SaveRollOnPlayerStatsTask = require('../tasks/server/set/SaveRollOnPlayerStats')
const SaveRollOnServerTask = require('../tasks/server/set/SaveRollOnServer')
const SaveMultipleRollsOnPlayerStatsTask = require('../tasks/server/set/SaveMultipleRollsOnPlayerStats')
const SaveMultipleRollsOnServerTask = require('../tasks/server/set/SaveMultipleRollsOnServer')

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
    this.saveRollStats()
    this.turn.addRoll(this.roll)
    return this.saveOrReturnWarning()
  }

  saveMultipleRollsOrReturnWarning() {
    this.saveMultipleRollStats()
    for (const roll of this.rolls) {
      this.turn.addRoll(roll)
    }
    return this.saveOrReturnWarning()
  }

  async saveRollStats() {
    if (this.roll.isTest || !this.isRanked) return
    new SaveRollOnPlayerStatsTask(this.serverId, this.player.stats(), this.roll.stats(), !this.player.rolled).addToQueue()
    new SaveRollOnServerTask(this.serverId, this.roll.stats()).addToQueue()
  }

  async saveMultipleRollStats() {
    if (!this.isRanked) return
    const stats = this.rolls.map(roll => roll.stats())
    new SaveMultipleRollsOnPlayerStatsTask(this.serverId, this.player.stats(), stats, !this.player.rolled).addToQueue()
    new SaveMultipleRollsOnServerTask(this.serverId, stats).addToQueue()
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