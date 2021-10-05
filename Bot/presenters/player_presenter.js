const RollPresenter = require('./roll_presenter');

module.exports = class PlayerPresenter {
  constructor(player) {
    this.player = player;
  }

  makeDescription(rolls, isExpanded) {
    if (isExpanded) {
      return this.makeExpandedDescription(rolls);
    } else {
      return this.makeCollapsedDescription(rolls);
    }
  }

  makeExpandedDescription(rolls) {
    if (!this.player.alive) return `${this.pingWithFaction()} has fallen.`;
    return `${this.pingWithFaction()}${this.describeBonus()} ${this.describeRolledWithLink(rolls)}${this.describeExtraRolls(rolls)}`;
  }

  makeCollapsedDescription(rolls) {
    if (!this.player.alive) return `~~${this.player.username}~~`;
    return `${this.pingWithFaction()}${this.describeBonus()} ${this.describeRollWithLink(rolls)}${this.describeExtraRolls(rolls)}`;
  }

  makeField(rolls) {
    if (!this.player.alive) return { name: `${this.player.username} has fallen`, value: `-`, inline: true }
    return {
      name: `${this.usernameWithFaction()}${this.describeBonus()}`,
      value: `${this.describeRolledWithLink(rolls)}${this.describeExtraRolls(rolls)}`,
      inline: true
    }
  }

  makeFieldWithIntention(rolls) {
    if (!this.player.alive) return { name: `${this.player.username} has fallen`, value: `-`, inline: true }
    return {
      name: `${this.usernameWithFaction()}${this.describeBonus()}`,
      value: `${this.describeRollWithIntention(rolls)}`,
      inline: true
    }
  }

  makeNoteField() {
    if (!this.player.note) return
    return {
      name: `${this.usernameWithFaction()}`,
      value: this.player.note,
      inline: true
    }
  }

  ping() {
    if (!this.player) return null
    return `<@!${this.player.id}>`
  }

  usernameWithFaction() {
    if (!this.player) return null
    const faction = this.player.name ? ` [${this.player.name}]` : ""
    return `${this.player.username}${faction}`
  }

  pingWithFaction() {
    if (!this.player) return null
    const faction = this.player.name ? ` [${this.player.name}]` : ""
    return `${this.ping()}${faction}`
  }

  describeBonus() {
    if (!this.player.bonus) return ""
    if (this.playerBonusIsAPositiveNumber()) {
      return ` +${this.player.bonus}`
    } else if (this.playerBonusIsANegativeNumber()) {
      return ` ${this.player.bonus}`
    } else {
      return ` <${this.player.bonus}>`
    }
  }

  playerBonusIsAPositiveNumber() {
    return !isNaN(this.player.bonus) && this.player.bonus > 0;
  }

  playerBonusIsANegativeNumber() {
    return !isNaN(this.player.bonus) && this.player.bonus < 0;
  }

  describeRolledWithLink(rolls) {
    if (!rolls || rolls.length === 0) return "-";
    return `${new RollPresenter(rolls[0]).makeRolledWithLink()}`;
  }

  describeRollWithLink(rolls) {
    if (!rolls || rolls.length === 0) return "";
    return `${new RollPresenter(rolls[0]).makeRollWithLink()}`;
  }

  describeExtraRolls(rolls) {
    if (!rolls || rolls.length < 2) return "";
    return ` (${rolls.length - 1} more)`;
  }

  describeRollWithIntention(rolls) {
    if (!rolls || rolls.length === 0) return "-";
    return `${new RollPresenter(rolls[0]).makeRollWithIntention()}`;
  }
}