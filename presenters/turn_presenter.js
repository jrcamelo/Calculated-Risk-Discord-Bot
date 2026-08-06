const Discord = require('../utils/discord_compat');
const PlayerPresenter = require('./player_presenter');
const RollPresenter = require('./roll_presenter');

module.exports = class TurnPresenter {
  constructor(game, turn) {
    this.game = game
    this.turn = turn
  }

  makeStatusEmbed() {
    let embed = new Discord.MessageEmbed()
      .setDescription(this.makeDescription(false))
      .addFields(this.makeFactionFields())
      .setFooter(this.makeStatusFooter())
    this.setGameTitle(embed)
    this.setMupImage(embed)
    return embed
  }

  makeStatusEmbedCollapsed() {
    let embed = new Discord.MessageEmbed()
      .setDescription(this.makeDescription(false))
      .addFields(this.makeFactionFields())
      .setFooter(this.makeStatusFooter())
    this.setGameTitle(embed)
    this.setMupThumbnail(embed)
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
    if (this.turn.description) {
      description += this.turn.description + "\n\n"
    }
    const rolls = this.turn.rollListToPlayerHash()
    for (let player of this.turn.playerHashToList()) {
      description += (new PlayerPresenter(player)).makeDescription(rolls[player.id], isExpanded) + "\n"
    }

    if (this.turn.lurkers && this.turn.lurkers.length) {
      description += "\nLurkers: "
      description += this.turn.lurkers
        .map(([id, faction]) => `<@!${id}>${faction ? ` (${faction})` : ""}`)
        .join(", ")
    }

    return description.trim() || "No players"
  }

  makeStatusEmbedExtras(isExpanded) {
    let embed = new Discord.MessageEmbed()
      .addFields(this.makeFieldsWithIntentions())
      .addFields(this.makeFactionFields())
      .setFooter(this.makeStatusFooter())
    this.setGameTitle(embed)
    isExpanded ? this.setMupImage(embed) : this.setMupThumbnail(embed)
    return embed
  }

  setGameTitle(embed) {
    const title = String(this.game.name || "").trim()
    if (title) embed.setTitle(title.substring(0, 250))
  }

  setMupImage(embed) {
    if (this.hasMup()) embed.setImage(this.turn.mup)
  }

  setMupThumbnail(embed) {
    if (this.hasMup()) embed.setThumbnail(this.turn.mup)
  }

  hasMup() {
    return typeof this.turn.mup === "string" && this.turn.mup.trim().length > 0
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
      factions.push(`${i + 1}. ${faction}`)
    }
    if (factions.length > 0) {
      return [{ name: "Unclaimed Factions", value: factions.join("\n") }]
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
      .setFooter(`${index + 1}~${index + 10}/${this.turn._rolls.length} - Turn ${this.turn.number}/${this.game.turnNumber}`)
    return embed;
  }

  makeHistoryEmbed(index, extra, filters, showBonuses = false) {
    const history = this.getFilteredHistory(filters)
    const total = history.length
    const pages = Math.max(1, Math.ceil(total / 10))
    let actualIndex = (index % pages) * 10
    actualIndex = isNaN(actualIndex) ? 0 : actualIndex

    let embed = new Discord.MessageEmbed()
      .setDescription(this.makeHistoryDescription(history, actualIndex, extra, showBonuses))
      .setFooter(`${Math.min(actualIndex + 10, total)}/${total} events - Turn ${this.turn.number}/${this.game.turnNumber}`)
    return embed
  }

  getFilteredHistory(filters) {
    if (!filters) return this.turn.history
    const hasTypes = filters.types && filters.types.size > 0
    const hasCats = filters.categories && filters.categories.size > 0
    if (!hasTypes && !hasCats) return this.turn.history

    return this.turn.history.filter(h =>
      (!hasTypes || filters.types.has(String(h.type).toLowerCase())) &&
      (!hasCats || filters.categories.has(String(h.category).toLowerCase()))
    )
  }

  makeHistoryDescription(history, index, extra, showBonuses = false) {
    const fields = []
    for (let i = index; i < index + 10; i++) {
      if (i < history.length) {
        let message = extra ? history[i].history : history[i].summary
        if (showBonuses) {
          message = this.addBonusesToHistoryMentions(message)
        }
        fields.push({ name: `\u200B`, value: message, inline: false })
      }
    }
    if (fields.length > 0) {
      let description = ""
      for (let field of fields) {
        let value = field.value.replace(/\r\n|\n|\r/g, "  ")
        if (description) description += "\n-\n"
        description += value
      }
      return description
    }
    return "No events"
  }

  addBonusesToHistoryMentions(message) {
    if (!message) return message
    return message.replace(/<@!?(\d+)>/g, (_match, id) => this.getPlayerPingWithBonus(id))
  }

  getPlayerPingWithBonus(id) {
    const player = this.turn.getPlayerFromId(id)
    if (!player) return `<@!${id}>`
    const bonus = this.describePlayerBonus(player.bonus)
    return `<@!${id}>${bonus}`
  }

  describePlayerBonus(bonus) {
    if (!bonus) return ""
    if (!isNaN(bonus) && bonus > 0) return ` +${bonus}`
    if (!isNaN(bonus) && bonus < 0) return ` ${bonus}`
    return ` <${bonus}>`
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
    if (description) description = `**${index + 1}~${index + 10}/${this.turn._rolls.length} - Turn ${this.turn.number}/${this.game.turnNumber}**\n${description}`
    return description || "No rolls"
  }

  makeCedeHistory(index, shorter) {
    if (this.turn.cedes == null) index = 0
    else index = index % (Math.ceil(this.turn.cedes.length / 10) * 10)

    let description = "";
    for (let i = index; i < index + 10; i++) {
      if (i < this.turn.cedes.length) {
        let cede = this.turn.cedes[i]
        if (shorter && cede.length > 150) cede = this.turn.cedes[i].substring(0, 150) + "..."
        description += cede + "\n\n";
      }
    }
    if (description) description = `**${index + 1}~${index + 10}/${this.turn.cedes.length} - Turn ${this.turn.number}/${this.game.turnNumber}**\n${description}`
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
    if (description) description = `**${index + 1}~${index + 10}/${this.turn.cedeMessages.length} - Turn ${this.turn.number}/${this.game.turnNumber}**\n${description}`
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
    const fields = this.makeAllianceFields()
    let embed = new Discord.MessageEmbed()
      .addFields(fields)
      .setFooter(`Turn ${this.turn.number} of ${this.game.turnNumber} - Master: ${this.game.masterUsername}`)
    return embed
  }

  makeAllianceFields() {
    const fields = this._makeAllianceFields(false)
    return this._fieldsTooLong(fields) ? this._makeAllianceFields(true) : fields
  }

  _makeAllianceFields(compact) {
    const diplomacy = this.turn.diplomacy
    if (!diplomacy || (!diplomacy.alliances && !diplomacy.onesided && false)) {
      const players = this.turn.playerHashToList()
      const value = players.map(p => compact ? this._pingOnly(p.id) : p.pingWithFaction()).join("\n")
      return [{ name: "Enemies", value }]
    }

    const fields = []

    if (diplomacy.alliances.length) {
      let text = ""
      for (let alliance of diplomacy.alliances) {
        text += alliance.map(p => this._pingWithMode(p, compact)).join("\n") + "\n\n"
      }
      fields.push({ name: "Alliances", value: text.trimEnd() })
    }

    if (diplomacy.onesided.length) {
      let text = ""
      for (let [a, b] of diplomacy.onesided) {
        text += this._pingWithMode(a, compact) + " → " + this._pingWithMode(b, compact) + "\n"
      }
      fields.push({ name: "Pending Alliances", value: text.trimEnd() })
    }

    if (diplomacy.loners.length) {
      let text = ""
      for (let loner of diplomacy.loners) {
        text += this._pingWithMode(loner, compact) + "\n"
      }
      fields.push({ name: "Without Alliances", value: text.trimEnd() })
    }

    return fields
  }

  makeNAPsEmbed() {
    const fields = this.makeNAPFields()
    let embed = new Discord.MessageEmbed()
      .addFields(fields)
      .setFooter(`Turn ${this.turn.number} of ${this.game.turnNumber} - Master: ${this.game.masterUsername}`)
    return embed
  }

  makeNAPFields() {
    const fields = this._makeNAPFields(false)
    return this._fieldsTooLong(fields) ? this._makeNAPFields(true) : fields
  }

  _makeNAPFields(compact) {
    const pacts = this.turn.pacts
    if (!pacts || (!pacts.alliances && !pacts.onesided && false)) {
      const players = this.turn.playerHashToList()
      const value = players.map(p => compact ? this._pingOnly(p.id) : p.pingWithFaction()).join("\n")
      return [{ name: "Enemies", value }]
    }

    const fields = []

    if (pacts.alliances.length) {
      let text = ""
      for (let alliance of pacts.alliances) {
        text += alliance.map(p => this._pingWithMode(p, compact)).join("\n") + "\n\n"
      }
      fields.push({ name: "Pacts", value: text.trimEnd() })
    }

    if (pacts.onesided.length) {
      let text = ""
      for (let [a, b] of pacts.onesided) {
        text += this._pingWithMode(a, compact) + " → " + this._pingWithMode(b, compact) + "\n"
      }
      fields.push({ name: "Pending Pacts", value: text.trimEnd() })
    }

    return fields
  }

  // existing, unchanged behavior
  getPlayerPingWithFaction(id) {
    const player = this.turn.getPlayerFromId(id)
    if (player) return player.usernameWithFactionNotBold()
    return `<@!${id}>`
  }

  // helpers
  _fieldsTooLong(fields) {
    return fields.some(f => (f.value ? f.value.length : 0) > 1024)
  }

  _pingWithMode(id, compact) {
    return compact ? this._pingOnly(id) : this.getPlayerPingWithFaction(id)
  }

  _pingOnly(id) {
    return `<@!${id}>`
  }
}
