const Discord = require('discord.js');
const PlayerPresenter = require('./player_presenter');
const TurnPresenter = require('./turn_presenter');
const { makePing } = require('../utils/discord')

module.exports = class GamePresenter {
  constructor(game) {
    this.game = game
  }

  makeStatusEmbed(turnIndex=this.game.turnNumber, isExpanded) {
    if (!isExpanded) return this.makeStatusEmbedCollapsed(turnIndex);
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeStatusEmbed()
  }

  makeStatusEmbedCollapsed(turnIndex=this.game.turnNumber) {    
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeStatusEmbedCollapsed()
  }  
  
  makeStatusEmbedExtras(turnIndex=this.game.turnNumber, isExpanded) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeStatusEmbedExtras(isExpanded)
  }

  makeNotesEmbed(turnIndex=this.game.turnNumber) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeNotesEmbed()
  }

  makeAlliancesEmbed(turnIndex=this.game.turnNumber) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeAlliancesEmbed()
  }

  makeNAPsEmbed(turnIndex=this.game.turnNumber) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeNAPsEmbed()
  }

  makeLinkListEmbed(turnIndex=this.game.turnNumber, index = 0) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeLinkListEmbed(index)
  }

  makeHistoryEmbed(turnIndex=this.game.turnNumber, index=0, extended) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeHistoryEmbed(index, extended)
  }
  
  makeRollHistory(turnIndex=this.game.turnNumber, index=0, intentions) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeRollHistory(index, intentions)
  }
  
  makeCedeHistory(turnIndex=this.game.turnNumber, index=0, showMessageLinks) {
    const turn = this.getTurn(turnIndex)
    const turnPresenter = new TurnPresenter(this.game, turn)
    if (!showMessageLinks) return turnPresenter.makeCedeHistory(index)
    else return turnPresenter.makeCedeHistoryLinks(index)
  }

  makeListOfAllMupsEmbed(index) {
    return new Discord.MessageEmbed()
      .addFields(this.makeMupFields(this.game.getMups(), index))
      .setFooter(`${index}/${this.game.turnNumber}`)
  }

  makeMupFields(mups, index=0) {
    let fields = []
    for (let i = index; i < Math.min(mups.length, index + 25); i++) {
      if (!mups[i]) continue
      fields.push({
        name: `Turn ${index + i}`,
        value: `[Link](${mups[i]})`,
        inline: true
      })
    }
    return fields
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
