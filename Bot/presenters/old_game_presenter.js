const Discord = require('discord.js');
const GetServerGames = require('../tasks/server/get/GetServerGames')
const GetServerChannelGames = require('../tasks/server/get/GetServerChannelGames')
const GetServerPlayerGames = require('../tasks/server/get/GetServerPlayerGames')
const { userIdtoDiscordPing, channelMention } = require('../utils/discord')
const { timestampToLocale } = require('../utils/text')

module.exports = class OldGamePresenter {
  constructor(serverId, step, sort) {
    this.serverId = serverId
    this.step = step
    this.sorting = sort
  }

  async getOldGames(name, masterId) {
    const filter = this.makeFilter(name, masterId)
    const task = new GetServerGames(this.serverId, null, null, filter, this.sort)
    this.result = await task.tryExecute()
  }

  async getOldGamesInChannel(name, masterId, channelId) {
    const filter = this.makeFilter(masterId, name)
    const task = new GetServerChannelGames(this.serverId, channelId, null, null, filter, this.sort)
    this.result = await task.tryExecute()
  }

  async getOldGamesWithPlayer(userId) {
    const task = new GetServerPlayerGames(this.serverId, userId, null, null, null, this.sort)
    this.result = await task.tryExecute()
  }

  makeFilter(masterId, name) {
    const filter = name ? { name: { $regex : new RegExp(name, "i") } } : {}
    if (masterId) filter.masterId = masterId
    return filter
  }

  makeEmbed(index) {
    const game = this.result[index]
    if (!game) return `Error?`
    const embed = new Discord.MessageEmbed()
      .setTitle(`${game.name}`)
      .setDescription(this.makeEmbedDescription(game))
      .setThumbnail(game.mup)
      .setFooter(`Game ${index + 1} / ${this.result.length}`)
    if (this.getPlayerCount(game)) {
      embed.addFields(this.makePlayerFields(game))
    }
    return embed
  }

  makeEmbedDescription(game) {
    let text = `**Master**: ${userIdtoDiscordPing(game.masterId)}`
    text += `\n${channelMention(game.channel)}`
    text += `\n\nStarted at ${timestampToLocale(game.startedAt)}`
    text += `\nFinished at ${timestampToLocale(game.endedAt)}`
    text += `\n\n${game.turnNumber} turns, ${this.getPlayerCount(game)} players`
    return text
  }

  makePlayerFields(game) {
    const alive = []
    const dead = []
    for (const playerId in game.players) {
      const player = game.players[playerId]
      const ping = userIdtoDiscordPing(playerId)
      if (player.alive && !player.removed) {
        alive.push(ping)
      } else {
        dead.push(ping)
      }
    }
    const fields = []
    if (alive.length) fields.push({ name: 'Alive', value: alive.join('\n') })
    if (dead.length) fields.push({ name: 'Dead', value: dead.join('\n') })
    if (!fields.length) fields.push({ name: 'No players?', value: '🤔' })
    return fields
  }

  getPlayerCount(game) {
    return game.players ? Object.keys(game.players).length : 0
  }
}