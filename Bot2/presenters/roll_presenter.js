module.exports = class RollPresenter {
  constructor(roll) {
    this.roll = roll
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
    if (masterId) return this.describeJustRolledAndPingMaster(masterId)
    const intention = this.roll.intention ? `\n**${this.roll.intention}**` : "" 
    return `${this.ping()} rolled ${this.roll.formattedValue}${intention}`
  }

  describeJustRolledAndPingMaster(masterId) {
    const intention = this.roll.intention ? `\n**${this.roll.intention}**` : "" 
    return `<@!${masterId}> —— ${this.ping()} rolled ${this.roll.formattedValue}${intention}`
  }
  
  ping() {
    return `<@${this.roll.playerId}>`
  }

}
