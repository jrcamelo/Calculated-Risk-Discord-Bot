const Discord = require('discord.js');
const PlayerPresenter = require('./player_presenter');
const RollPresenter = require('./roll_presenter');

module.exports = class TurnPresenter {
  constructor(game, turn) {
    this.game = game
    this.turn = turn
  }

  makeStatusEmbed() {    
    let embed = new Discord.MessageEmbed()
        .setTitle(`${this.game.name}`)
        .setDescription(this.makeDescription(false))
        .addFields(this.makeFactionFields())
        .setFooter(`Turn ${this.turn.number} of ${this.game.turnNumber} - Master: ${this.game.masterUsername}`)
        .setImage(this.turn.mup)
    return embed
  }

  makeStatusEmbedCollapsed() {
    let embed = new Discord.MessageEmbed()
      .setDescription(this.makeDescription(false))
      .addFields(this.makeFactionFields())
      .setFooter(`Turn ${this.turn.number}/${this.game.turnNumber} - Master: ${this.game.masterUsername}`)
      .setThumbnail(this.turn.mup)
    return embed
  }
  
  makeFields() {
    const fields = []
    const rolls = this.turn.rollListToPlayerHash()
    for (let player of this.turn.playerHashToList()) {
      fields.push((new PlayerPresenter(player)).makeField(rolls[player.id]))
    }
    return fields
  }

  makeDescription(isExpanded) {
    let description = ""
    const rolls = this.turn.rollListToPlayerHash()
    for (let player of this.turn.playerHashToList()) {
      description += (new PlayerPresenter(player)).makeDescription(rolls[player.id], isExpanded) + "\n"
    }
    return description || "No players"
  }
  
  makeStatusEmbedExtras(isExpanded) {
    let embed = new Discord.MessageEmbed()
        .setTitle(`${this.game.name}`)
        .addFields(this.makeFieldsWithIntentions())
        .addFields(this.makeFactionFields())
        .setFooter(`Turn ${this.turn.number} of ${this.game.turnNumber} - Master: ${this.game.masterUsername}`)
    isExpanded ? embed.setImage(this.turn.mup) : embed.setThumbnail(this.turn.mup)
    return embed
  }

  makeFieldsWithIntentions() {
    const fields = []
    const rolls = this.turn.rollListToPlayerHash()
    for (let player of this.turn.playerHashToList()) {
      fields.push((new PlayerPresenter(player)).makeFieldWithIntention(rolls[player.id]))
    }
    return fields
  }

  makeFactionFields() {
    const factions = []
    for (let i = 0; i < this.turn.factionSlots.length; i++) {
      const faction = this.turn.factionSlots[i];
      factions.push(`${i+1}. ${faction}`)
    }
    if (factions.length > 0) {
      return [{name: "Unclaimed Factions", value: factions.join("\n")}]
    } else {
      return []
    }
  }

  makeLinkListEmbed(index) {
    index = index % (Math.ceil(this.turn._rolls.length / 10) * 10)

    let description = "";
    for (let i = index; i < index + 10; i++) {
      if (i < this.turn._rolls.length) {
        description += (new RollPresenter(this.turn._rolls[i])).makeDescriptionWithPingAndLink() + "\n";
      }
    }
    let embed = new Discord.MessageEmbed()
      .setDescription(description || "No rolls")
      .setFooter(`${index+1}~${index+10}/${this.turn._rolls.length} - Turn ${this.turn.number}/${this.game.turnNumber}`)
    return embed;
  }

  makeRollHistory(index, intentions) {
    index = index % (Math.ceil(this.turn._rolls.length / 10) * 10)

    let description = "";
    for (let i = index; i < index + 10; i++) {
      if (i < this.turn._rolls.length) {
        const presenter = new RollPresenter(this.turn._rolls[i])
        const text = intentions ? presenter.makeDescriptionWithPingAndIntention() : presenter.makeDescriptionWithPing()
        description += text + "\n";
      }
    }
    if (description) description = `**${index+1}~${index+10}/${this.turn._rolls.length} - Turn ${this.turn.number}/${this.game.turnNumber}**\n${description}`
    return description || "No rolls"
  }

  makeNotesEmbed() {        
    let embed = new Discord.MessageEmbed()
        .setTitle(`Notes`)
        .addFields(this.makeNoteFields())
        .setFooter(`Turn ${this.turn.number} of ${this.game.turnNumber} - Master: ${this.game.masterUsername}`)
    return embed
  }

  makeNoteFields() {
    const fields = []
    for (let player of this.turn.playerHashToList()) {
      const field = (new PlayerPresenter(player)).makeNoteField()
      if (field) fields.push(field)
    }
    return fields
  }

  makeAlliancesEmbed() {
    let embed = new Discord.MessageEmbed()
        .setTitle(`Alliances`)
        .addFields(this.makeAllianceFields())
        .setFooter(`Turn ${this.turn.number} of ${this.game.turnNumber} - Master: ${this.game.masterUsername}`)
    return embed
  }

  // Makes alliance groups, one-sided alliances and loners
  // Returns { alliances: [], onesided: [], loners: [] }
  // e.g. { alliances: [ [player1, player2, player5], [player3, player4] ], onesided: [ [player5, player6] ], loners: [player7] }
  makeAllianceGroups() {
    const allies = {}
    const onesided = []
    const loners = []
    const alreadyCounted = {}
    const players = this.turn.playerHashToList()
    for (let player of players) {
      if (player.getAllies().length === 0) {
        loners.push(player)
      }
      for (let allyId of player.getAllies()) {
        const ally = this.turn.getPlayer({id: allyId})
        if (!ally) continue
        if (alreadyCounted[[player.id, ally.id]]) continue
        alreadyCounted[[ally.id, player.id]] = true
        if (ally.isAlliedWith(player.id)) {
          allies[player, ally] = [player, ally]
        } else {
          onesided.push([player, ally])
        }
      }
    }

    // TODO


  }

  makeAllianceFields() {
    const groups = this.makeAllianceGroups()
    const fields = []
    for (let group of groups) {
      const field = this.makeAllianceField(group)
      if (field) fields.push(field)
    }
  }

  makeAllianceField(group) {
    const players = group.map(player => player.ping()).join("\n")
    if (group.length === 1) {
      return {name: "Loner", value: players}
    } else {
      return {name: `Alliance of ${group.length}`, value: players}
    }
  }
}
