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
        .setFooter(this.makeStatusFooter())
        .setImage(this.turn.mup)
    return embed
  }

  makeStatusEmbedCollapsed() {
    let embed = new Discord.MessageEmbed()
      .setDescription(this.makeDescription(false))
      .addFields(this.makeFactionFields())
      .setFooter(this.makeStatusFooter())
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
        .setFooter(makeStatusFooter())
    isExpanded ? embed.setImage(this.turn.mup) : embed.setThumbnail(this.turn.mup)
    return embed
  }

  makeStatusFooter() {
    const total = this.turn.playerHashToList().length
    const alive = this.turn.playerHashToList().filter(player => player.alive).length
    const rolled = this.turn.playerHashToList().filter(player => player.rolled && player.alive).length
    return `Turn ${this.turn.number}/${this.game.turnNumber} — ${rolled}R/${alive}A/${total} players — Master: ${this.game.masterUsername}`
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
        description += (new RollPresenter(this.turn._rolls[i], null, this.turn._players)).makeDescriptionWithUserAndLink() + "\n";
      }
    }
    let embed = new Discord.MessageEmbed()
      .setDescription(description || "No rolls")
      .setFooter(`${index+1}~${index+10}/${this.turn._rolls.length} - Turn ${this.turn.number}/${this.game.turnNumber}`)
    return embed;
  }
  
  makeHistoryEmbed(index, extra) {
    let actualIndex = (index % Math.ceil(this.turn.history.length/10)) * 10
    actualIndex = isNaN(actualIndex) ? 0 : actualIndex
    let embed = new Discord.MessageEmbed()
        .setDescription(this.makeHistoryDescription(actualIndex, extra))
        .setFooter(`${Math.min(actualIndex+10, this.turn.history.length)}/${this.turn.history.length} events - Turn ${this.turn.number}/${this.game.turnNumber}`)
    return embed
  }

  makeHistoryDescription(index, extra) {
    const fields = []
    for (let i = index; i < index + 10; i++) {
      if (i < this.turn.history.length) {
        let message = extra ? this.turn.history[i].history : this.turn.history[i].summary
        fields.push({name: `\u200B`, value: message, inline: false})
      }
    }
    // Just in case I need to change back to fields
    if (fields.length > 0) {
      let description = ""
      for (let field of fields) {
        let value = field.value.replace("\n", "  ")
        if (description) description += "\n-\n"
        description += value
      }
      return description
    }
    return "No events"
  }

  makeRollHistory(index, intentions) {
    index = index % (Math.ceil(this.turn._rolls.length / 10) * 10)

    let description = "";
    for (let i = index; i < index + 10; i++) {
      if (i < this.turn._rolls.length) {
        const roll = this.turn._rolls[i]
        const presenter = new RollPresenter(roll, null, this.turn._players)
        const text = intentions ? presenter.makeDescriptionWithUserAndIntention() : presenter.makeDescriptionWithUser()
        description += text + "\n";
      }
    }
    if (description) description = `**${index+1}~${index+10}/${this.turn._rolls.length} - Turn ${this.turn.number}/${this.game.turnNumber}**\n${description}`
    return description || "No rolls"
  }

  makeCedeHistory(index) {
    index = index % (Math.ceil(this.turn.cedes.length / 10) * 10)

    let description = "";
    for (let i = index; i < index + 10; i++) {
      if (i < this.turn.cedes.length) {
        const cede = this.turn.cedes[i]
        description += cede + "\n\n";
      }
    }
    if (description) description = `**${index+1}~${index+10}/${this.turn.cedes.length} - Turn ${this.turn.number}/${this.game.turnNumber}**\n${description}`
    return description || "Nothing was ceded."
  }

  makeCedeHistoryLinks(index) {
    index = index % (Math.ceil(this.turn.cedeMessages.length / 10) * 10)

    let description = "";
    for (let i = index; i < index + 10; i++) {
      if (i < this.turn.cedeMessages.length) {
        const cede = this.turn.cedeMessages[i]
        description += cede + "\n\n";
      }
    }
    if (description) description = `**${index+1}~${index+10}/${this.turn.cedeMessages.length} - Turn ${this.turn.number}/${this.game.turnNumber}**\n${description}`
    return description || "Nothing was ceded."
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
        text += this.getPlayerPingWithFaction(unrequited[0]) + " → " + this.getPlayerPingWithFaction(unrequited[1]) + "\n"
      }
      fields.push({name: "Pending Alliances", value: text})
    }

    if (diplomacy.loners.length) {
      let text = ""
      for (let loner of diplomacy.loners) {
        text += this.getPlayerPingWithFaction(loner) + "\n"
      }
      fields.push({name: "Without Alliances", value: text})
    }

    return fields
  }

  makeNAPsEmbed() {
    let embed = new Discord.MessageEmbed()
        .addFields(this.makeNAPFields())
        .setFooter(`Turn ${this.turn.number} of ${this.game.turnNumber} - Master: ${this.game.masterUsername}`)
    return embed
  }

  makeNAPFields() {
    const pacts = this.turn.pacts
    if (!pacts || (!pacts.alliances && !pacts.onesided && false)) {
      const players = this.turn.playerHashToList()
      return [
        {name: "Enemies", value:  players.map(p => p.pingWithFaction()).join("\n")},
      ]
    }

    const fields = []
    if (pacts.alliances.length) {
      let text = ""
      for (let alliance of pacts.alliances) {
        text += alliance.map(p => this.getPlayerPingWithFaction(p)).join("\n") + "\n\n"
      }
      fields.push({name: "Pacts", value: text})
    }

    if (pacts.onesided.length) {
      let text = ""
      for (let unrequited of pacts.onesided) {
        text += this.getPlayerPingWithFaction(unrequited[0]) + " → " + this.getPlayerPingWithFaction(unrequited[1]) + "\n"
      }
      fields.push({name: "Pending Pacts", value: text})
    }

    return fields
  }

  getPlayerPingWithFaction(id) {
    const player = this.turn.getPlayerFromId(id)
    if (player) {
      return player.usernameWithFactionNotBold()
    } else {
      return `<@!${id}>`
    }
  }
}
