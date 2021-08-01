const Discord = require('discord.js');
const PlayerPresenter = require('./player_presenter');
const TurnPresenter = require('./turn_presenter');

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

  makeLinkListEmbed(turnIndex=this.game.turnNumber, index = 0) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeLinkListEmbed(index)
  }

  makeRollHistory(turnIndex=this.game.turnNumber, index=0, intentions) {
    const turn = this.getTurn(turnIndex)
    return (new TurnPresenter(this.game, turn)).makeRollHistory(index, intentions)
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
  
}
