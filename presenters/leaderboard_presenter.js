const Discord = require('discord.js');
const GetRollLeaderboardTask = require('../tasks/server/get/GetRollLeaderboard');
const GetPlayerLeaderboardTask = require('../tasks/server/get/GetPlayerLeaderboard');
const PlayerStats = require('../models/player_stats');

module.exports = class LeaderboardPresenter {
  constructor(serverId, step=10, limit=100, user) {
    this.serverId = serverId
    this.userId = user ? user.id : null
    this.step = step
    this.limit = limit
    this.result = []
  }

  async getRollsLeaderboard() {
    this.result = await (new GetRollLeaderboardTask(this.serverId, 0, this.limit, this.userId)).tryExecute()
  }

  async makeRollsLeaderboardEmbed(index=0) {
    if (this.result.length == 0) await this.getRollsLeaderboard()
    if (this.result.length == 0) return "There are no rolls in the server."
    return new Discord.MessageEmbed()
      .setTitle(`Hall of Rolls`)
      .addFields(this.makeRollsLeaderboardFields(index))
  }

  makeRollsLeaderboardFields(index=0) {
    const fields = []
    for (let i = index; i < index + this.step; i++) {
      if (i >= this.result.length) break
      const roll = this.result[i]
      fields.push(this.makeRollField(roll, i))
    }
    return fields;
  }

  makeRollField(roll, i) {
    let name = `#${i + 1}`
    let value = `[${roll.formattedValue}](${this.makeMessageLink(roll)})`
    value += `\n${this.makePing(roll)}`
    value += `\n${this.makeChannelMention(roll)}`
    value += `\n${this.makeDateText(roll)}`
    // value += `\n${roll.score} pts.`
    return { name, value, inline: true }
  }


  async getPlayersLeaderboard(sorting) {
    this.result = await (new GetPlayerLeaderboardTask(this.serverId, 0, this.limit, sorting)).tryExecute()
  }

  async makePlayersLeaderboardEmbed(index=0, sorting) {
    if (this.result.length == 0) await this.getPlayersLeaderboard(sorting)
    if (this.result.length == 0) return "There are no players in the server."
    let sortingText = ""
    for (let s of Object.keys(sorting)) {
      sortingText += `${s.toUpperCase()} `
    }
    return new Discord.MessageEmbed()
      .setTitle(`Player Ranking`)
      .setDescription(`Sorted by ${sortingText}`)
      .addFields(this.makePlayersLeaderboardFields(index))
  }

  makePlayersLeaderboardFields(index=0) {
    const fields = []
    for (let i = index; i < index + this.step; i++) {
      if (i >= this.result.length) break
      const player = this.result[i]
      fields.push(this.makePlayerField(player, i))
    }
    return fields;
  }

  makePlayerField(player, i) {
    let name = `#${i + 1}`
    let value = `<@!${player.id}>`
    value += `\n**Level: ${PlayerStats.xpToLevel(player.totalXp)}**`
    value += `\nXP: ${player.totalXp}`
    value += `\n${player.wins}w / ${player.games - player.wins}d`
    if (player.hostCount > 0) {
      value += ` / ${player.hostCount}h`
    }
    value += `\nRolls: ${player.totalRolls}`
    value += `\nLuck: ${player.luck.toFixed(0) || "?"}`
    return { name, value, inline: true }
  }

  makePing(roll) {
    return `<@!${roll.playerId}>`
  }

  makeMessageLink(roll) {
    return `https://discordapp.com/channels/${this.serverId}/${roll.channelId}/${roll.messageId}`
  }

  makeChannelMention(roll) {
    return `<#${roll.channelId}>`
  }

  makeDateText(roll) {
    const date = new Date(roll.time)
    return date.toLocaleDateString()
  }
}
