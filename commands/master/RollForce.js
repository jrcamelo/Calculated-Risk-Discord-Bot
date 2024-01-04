const RollCommand = require("../rolls/Roll")
const Roll = require("../../models/roll")
const Database = require("../../database")
const Discord = require("discord.js")
const BaseCommand = require("../base_command")
const RollPresenter = require("../../presenters/roll_presenter")



module.exports = class ForceRollCommand extends BaseCommand {
  static aliases = ["ForceRoll", "SkipPlayer", "frfr"]
  static description = "Skips a player by rolling for them"

  canDelete = false
  masterOnly = true
  needsGame = true
  neededArgsAmount = 1
  needsMention = true
  acceptsPlayerNotInServer = true
  needsMentionedPlayer = true  
  canMention = true
  playerOnly = false

  async execute() {
    this.roll = new Roll(this.message, this.arg, this.gameTime, this.turnNumber, this.limit, this.isTest, this.isRanked)
    this.roll.playerId = this.mentionedPlayer.id
    this.roll.doRollWithLimit()
    this.turn.addRoll(this.roll)
    if (!this.saveOrReturnWarning()) this.sendSingleRollResult()
  }

  async sendSingleRollResult() {
    let masterId = this.game ? this.game.masterId : null
    if (this.isTest) masterId = null
    let text = (new RollPresenter(this.roll)).describeJustRolled(masterId)
    if (!this.isTest && this.turn && this.turn.everyoneHasRolled()) {
      text += "\n\n**All players have rolled this turn!**"
    }
    await this.sendReply(text + (this.isTest ? " (test)" : ""))
    if (this.roll.emote)
      this.reply.react(this.roll.emote)
    return this.reply
  }
}