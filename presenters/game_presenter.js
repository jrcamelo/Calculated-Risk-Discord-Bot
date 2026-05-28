const Discord = require('discord.js');
const PlayerPresenter = require('./player_presenter');
const TurnPresenter = require('./turn_presenter');
const { makePing } = require('../utils/discord')

module.exports = class GamePresenter {
  constructor(game) {
    this.game = game
  }

  makeStatusEmbed(turnIndex = this.game.turnNumber, isExpanded) {
    if (!isExpanded) return this.makeStatusEmbedCollapsed(turnIndex);
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeStatusEmbed()
  }

  makeStatusEmbedCollapsed(turnIndex = this.game.turnNumber) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeStatusEmbedCollapsed()
  }

  makeStatusEmbedExtras(turnIndex = this.game.turnNumber, isExpanded) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeStatusEmbedExtras(isExpanded)
  }

  makeMiniStatusEmbed(turnIndex = this.game.turnNumber) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeMiniStatusEmbed()
  }

  makeNotesEmbed(turnIndex = this.game.turnNumber) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeNotesEmbed()
  }

  makeAlliancesEmbed(turnIndex = this.game.turnNumber) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeAlliancesEmbed()
  }

  makeNAPsEmbed(turnIndex = this.game.turnNumber) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeNAPsEmbed()
  }

  makeLinkListEmbed(turnIndex = this.game.turnNumber, index = 0) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeLinkListEmbed(index)
  }

  makeHistoryEmbed(turnIndex = this.game.turnNumber, index = 0, extended, filters) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeHistoryEmbed(index, extended, filters)
  }  

  makeRollHistory(turnIndex = this.game.turnNumber, index = 0, intentions) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeRollHistory(index, intentions)
  }

  makeCedeHistory(turnIndex = this.game.turnNumber, index = 0, showMessageLinks, shorter) {
    const turn = this.getTurn(turnIndex)
    if (turn == null) console.log("ERROR: Turn " + turnIndex)
    const turnPresenter = new TurnPresenter(this.game, turn)
    if (!showMessageLinks) return turnPresenter.makeCedeHistory(index, shorter)
    else return turnPresenter.makeCedeHistoryLinks(index)
  }

  makeListOfAllMupsEmbed(index, step) {
    return new Discord.MessageEmbed()
      .addFields(this.makeMupFields(this.game.getMups(), index, step))
      .setFooter(`${index+step-1}/${this.game.turnNumber}`)
  }

  makeMupFields(mups, index = 0, step) {
    let fields = []
    for (let i = index; i < Math.min(mups.length, index + step); i++) {
      if (!mups[i]) continue
      fields.push({
        name: `Turn ${i}`,
        value: `[Link](${mups[i]})`,
        inline: true
      })
    }
    return fields
  }

  makeListOfAllMupLinks(index, step) {
    let links = []
    let mups = this.game.getMups()
    for (let i = index; i < Math.min(mups.length, index + step); i++) {
      if (!mups[i]) continue
      links.push(`${mups[i]}`)
    }
    let result = links.join("\n")
    return result || `No mups at ${index+step}/${this.game.turnNumber}`
  }

  getTurn(turnIndex) {
    return this.game.getTurn(turnIndex)
  }

  makeGGMessage() {
    let text = ""
    for (let player of this.getTurn().playerHashToList()) {
      text += makePing(player) + " "
    }
    text += "\n**GG, thanks for playing!**"
    text += `\n\nGame Master earned **${this.game.calculateMasterXp()}** XP`
    text += `\nWinners earned **${this.game.calculateWinnersXp()}** XP`
    text += `\nLosers earned **${this.game.calculateLosersXp()}** XP`
    return text
  }
}
