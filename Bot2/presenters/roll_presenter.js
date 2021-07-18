const ordinal = require('ordinal')

module.exports = class RollPresenter {
  constructor(roll, rolls) {
    this.roll = roll
    this.rolls = rolls
  }

  makeRolledWithLink() {
    return `[rolled](${this.roll.messageLink}) ${this.roll.formattedValue}`
  }

  makeRollWithLink() {
    return `[${this.roll.formattedValue}](${this.roll.messageLink})`
  }

  makeRollWithIntention() {
    const intention = this.roll.intention ? ` -${this.roll.intention.substring(0, 128)}` : ''
    return `[${this.roll.formattedValue}](${this.roll.messageLink})${intention}`
  }

  makeDescriptionWithPing() {
    return `${this.ping()} rolled ${this.roll.formattedValue}`
  }

  makeDescriptionWithPingAndLink() {
    return `${this.ping()} [rolled](${this.roll.messageLink}) ${this.roll.formattedValue}`
  }

  makeDescriptionWithPingAndIntention() {
    const intention = this.roll.intention ? ` - ${this.roll.intention.substring(0, 256)}` : ''
    return `${this.ping()} rolled ${this.roll.formattedValue} ${intention}`
  }

  describeJustRolled(masterId) {
    const intention = this.roll.intention ? `\n**${this.roll.intention}**` : "" 
    return `${this.pingMaster(masterId)}${this.ping()} rolled ${this.roll.formattedValue}${intention}`
  }
  
  describeMultipleJustRolled(masterId) {
    if (!this.rolls) return
    const intention = this.rolls[0].intention ? `\n**${this.rolls[0].intention}**` : ""
    let text = `${this.pingMaster(masterId)}${this.ping()} rolled ${this.rolls.length} times${intention}`
    for (let i = 0; i < this.rolls.length; i++) {
      text += `\n${ordinal(i+1)} - ${this.rolls[i].formattedValue}`
    }
    return text
  }

  ping() {
    return `<@${this.roll ? this.roll.playerId : this.rolls[0].playerId}>`
  }

  pingMaster(masterId) {
    return masterId ? `<@!${masterId}> —— ` : ""
  }

}
