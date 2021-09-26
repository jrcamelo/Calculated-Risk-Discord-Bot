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

  makeAllianceFields() {
    const diplomacy = this.turn.diplomacy
    if (!diplomacy || (!diplomacy.alliances && !diplomacy.onesided && false)) {
      const players = this.turn.playerHashToList()
      return [
        {name: "Enemies", value:  players.map(p => p.pingWithFaction()).join("\n")},
      ]
    }

    const fields = []
    if (diplomacy.alliances.length) {
      let text = ""
      for (let alliance of diplomacy.alliances) {
        text += alliance.map(p => this.getPlayerPingWithFaction(p)).join("\n") + "\n\n"
      }
      fields.push({name: "Alliances", value: text})
    }

    if (diplomacy.onesided.length) {
      let text = ""
      for (let unrequited of diplomacy.onesided) {
        text += this.getPlayerPingWithFaction(unrequited[0]) + " -> " + this.getPlayerPingWithFaction(unrequited[1]) + "\n"
      }
      fields.push({name: "Unrequited Alliances", value: text})
    }

    if (diplomacy.loners.length) {
      let text = ""
      for (let loner of diplomacy.loners) {
        text += this.getPlayerPingWithFaction(loner) + "\n"
      }
      fields.push({name: "Loners", value: text})
    }

    return fields
  }

  getPlayerPingWithFaction(id) {
    const player = this.turn.getPlayer(id)
    if (player) {
      return player.pingWithFaction()
    } else {
      return `<@!${id}>`
    }
  }
}
