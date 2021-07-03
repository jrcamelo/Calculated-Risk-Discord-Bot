require("dotenv").config();
const path = require("path")

const SERVER_FOLDER = "servers"
const ONGOING_GAME_FOLDER = "ongoing"
const GAME_FILE_NAME = "game.json"
const PREVIOUS_GAME_FOLDER = "previous"
const PREVIOUS_GAME_LIST_FILE_NAME = "previous.json"
const PLAYERS_FILE_NAME = "players.json"
const ROLLS_FILE_NAME = "rolls.json"
const TURN_FILE_NAME = "turn.json"
function TURN_FOLDER_NAME(turn) { return `turn-${turn}` }

class PathTo {  
  constructor(channel) {
    this.base = path.join(process.cwd(), process.env.DATABASE_PATH)
    if (channel != null && channel.guild != null) {
      this.channelId = channel.id
      this.serverId = channel.guild.id
    }
  }

  channel() {
    if (this.serverId == null || this.channelId == null) return null
    return path.join(this.base, SERVER_FOLDER, this.serverId, this.channelId)
  }

  game() {
    const parentPath = this.channel()
    if (parentPath == null) return null
    return path.join(parentPath, ONGOING_GAME_FOLDER)
  }

  gameFile() {
    const parentPath = this.game()
    if (parentPath == null) return null
    return path.join(parentPath, GAME_FILE_NAME)
  }

  turnFolder(turn="current") {
    const parentPath = this.game()
    if (parentPath == null) return null
    return path.join(parentPath, TURN_FOLDER_NAME(turn))
  }

  turnFile(turn="current") {
    const parentPath = this.turnFolder(turn)
    if (parentPath == null) return null
    return path.join(parentPath, TURN_FILE_NAME)
  }

  playersFile(turn="current") {
    const parentPath = this.turnFolder(turn)
    if (parentPath == null) return null
    return path.join(parentPath, PLAYERS_FILE_NAME)
  }

  rollsFile(turn="current") {
    const parentPath = this.turnFolder(turn)
    if (parentPath == null) return null
    return path.join(parentPath, ROLLS_FILE_NAME)
  }
  
  previousGames() {
    const parentPath = this.channel()
    if (parentPath == null) return null
    return path.join(parentPath, PREVIOUS_GAME_FOLDER)
  }

  previousGameListFile() {
    const parentPath = this.channel()
    if (parentPath == null) return null
    return path.join(parentPath, PREVIOUS_GAME_LIST_FILE)
  }

  previousGame(title) {
    const parentPath = this.previousGames()
    if (parentPath == null) return null
    return path.join(parentPath, title)
  }
  
  previousGameFile(title) {
    const parentPath = this.previousGame(title)
    if (parentPath == null) return null
    return path.join(parentPath, GAME_FILE_NAME)
  }
}
module.exports = PathTo

/*
/storage/
/storage/servers/
/storage/servers/<server id>/<channel id>/
/storage/servers/<server id>/<channel id>/ongoing/
/storage/servers/<server id>/<channel id>/ongoing/game.json
/storage/servers/<server id>/<channel id>/ongoing/turn-current.json
/storage/servers/<server id>/<channel id>/ongoing/turn-<number>.json
/storage/servers/<server id>/<channel id>/previous/previous.json
/storage/servers/<server id>/<channel id>/previous/<game id>/

*/