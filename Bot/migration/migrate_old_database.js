const fse = require('fs-extra');
const base32 = require('base32');
const sanitize = require('sanitize-filename');

module.exports = class Migrator {

  constructor(path, newPath, serverIds) {
    this.path = path;
    this.newPath = newPath;
    this.serverIds = serverIds;
    this.servers = {}
    this.games = []
  }

  migrate() {
    const oldDatabase = fse.readJsonSync(this.path);
    for (const key of Object.keys(oldDatabase)) {
      if (!key.startsWith('CHANNEL_')) continue
      if (key.endsWith('BACKUP')) continue
      this.parse(oldDatabase[key])
    }
    this.write()
  }

  parse(channel) { 
    if (!channel || !channel.game) return
    const serverId = this.getServerId(channel)
    this.storeServerAndChannelIds(serverId, channel.id)
    const gameInstance = {}
    gameInstance.serverId = serverId
    gameInstance.channelId = channel.id
    gameInstance.game = this.readGame(channel.game, channel.id)
    gameInstance.turns = this.readTurns(channel.game.turns, channel.id)
    this.games.push(gameInstance)
  }

  getServerId(channel) {
    const serverId = this.serverIds[channel.id];
    if (serverId) return serverId;
    const serverName = base32.decode(channel.server);
    return sanitize(serverName);
  }

  storeServerAndChannelIds(serverId, channelId) { 
    if (!this.servers[serverId]) this.servers[serverId] = [];
    this.servers[serverId].push(channelId);
  }

  readGame(game, channelId) {
    return {
      channel: channelId,
      name: base32.decode(game.name),
      masterId: game.master.id,
      masterUsername: base32.decode(game.master.username),
      turnNumber: game.currentTurn,
      startedAt: game.startedAt,
      endedAt: game.endedAt,
      uniqueId: `${channelId}-${game.startedAt}`
    }
  }

  readTurns(turns, channelId) {
    const turnsInstance = {
      turns: [],
      players: [],
      rolls: []
    }
    for (let number = 0; number < turns.length; number++) {
      const turnData = turns[number];
      turnsInstance.turns.push(this.readTurnData(turnData, number))
      turnsInstance.players.push(this.readTurnPlayers(turnData))
      turnsInstance.rolls.push(this.readTurnRolls(turnData, channelId))
    }
    return turnsInstance
  }

  readTurnData(turnData, number) {
    return {
      number: number,
      mup: base32.decode(turnData.mup || ""),
      description: base32.decode(turnData.description || ""),
    }
  }

  readTurnPlayers(turnData) {
    const players = {}
    for (const playerId of Object.keys(turnData.players)) {
      const player = turnData.players[playerId]
      players[playerId] = {
        id: player.user.id,
        username: base32.decode(player.user.username),
        avatar: player.user.avatar,
        name: base32.decode(player.name),
        alive: player.alive,
        rolled: player.rolled,
      }
    }
    return players
  }

  readTurnRolls(turnData, channelId) {
    const rolls = []
    for (const playerId of Object.keys(turnData.players)) {
      const player = turnData.players[playerId]
      if (!player.rolled) continue
      for (const roll of player.rolls) {
        rolls.push({
          messageId: roll.messageId,
          messageLink: roll.messageLink,
          playerId,
          channelId,
          limit: roll.limit,
          test: false,
          ranked: false,
          intention: base32.decode(roll.intention),
          time: roll.time,
          value: roll.value,
          formattedValue: roll.result,
          specialValue: this.getSpecialValue(roll.result),
        })
      }
    }
    return rolls.sort((a, b) => a.time - b.time)
  }

  getSpecialValue(result) {
    const match = result.match(/\*\*(\d+)\*\*/)
    if (match) return match[1]
    return null
  }
  
  write() {
    for (const instance of this.games) {
      this.writeGame(instance)
    }
  }
  
  writeGame(instance) {
    this.createServerAndChannelFolders(instance)
    let path = `${this.newPath}/servers/${instance.serverId}/${instance.channelId}/ongoing`
    if (instance.game.endedAt) {
      path = `${this.newPath}/servers/${instance.serverId}/${instance.channelId}/previous/${instance.uniqueId}`
    }
    fse.ensureDirSync(path)
    this.writeGameFiles(instance, path)
  }

  createServerAndChannelFolders(instance) {
    const serverId = instance.serverId
    const channelId = instance.channelId
    const serverPath = `${this.newPath}/servers/${serverId}`
    const channelPath = `${serverPath}/${channelId}`
    const ongoingPath = `${channelPath}/ongoing`
    const previousPath = `${channelPath}/previous`
    fse.ensureDirSync(serverPath)
    fse.ensureDirSync(channelPath)
    fse.ensureDirSync(ongoingPath)
    fse.ensureDirSync(previousPath)
  }

  writeGameFiles(instance, path) {
    fse.writeJSONSync(path + "/game.json", instance.game)
    for (let i = 0; i < instance.turns.turns.length; i++) {
      const turnData = instance.turns.turns[i];
      const playersData = instance.turns.players[i];
      const rollsData = instance.turns.rolls[i];
      const turnPath = `${path}/turn-${i}/`
      fse.ensureDirSync(turnPath)
      fse.writeJSONSync(`${turnPath}/turn.json`, turnData)
      fse.writeJSONSync(`${turnPath}/players.json`, playersData)
      fse.writeJSONSync(`${turnPath}/rolls.json`, rollsData)
    }
  }
}

// Server ID
// Channel ID
// Game ID = ChannelID-startedAt
// Game => {
//   channel,
//   name,
//   masterId,
//   masterUsername,
//   turnNumber,
//   startedAt,
//   endedAt
// }
// Turn => {
//   description,
//   mup,
//   number
// }
// Turn number
// Players => {
//   id: {
//     id,
//     username,
//     avatar,
//     name,
//     alive,
//     rolled,
//   }
// }
// Rolls => [
//   {
//     messageId,
//     messageLink,
//     playerId,
//     channelId,
//     intention,
//     limit,
//     test,
//     ranked,
//     time,
//     value,
//     formattedValue,
//     specialValue,
//   }
// ]
