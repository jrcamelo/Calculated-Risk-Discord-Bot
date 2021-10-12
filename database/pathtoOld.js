require("dotenv").config();
const path = require("path")

const PathTo = require("./pathto")

const SERVER_FOLDER = "servers"
const ONGOING_GAME_FOLDER = "ongoing"
const GAME_FILE_NAME = "game.json"
const PREVIOUS_GAME_FOLDER = "previous"
const PREVIOUS_GAME_LIST_FILE_NAME = "previous.json"
const PLAYERS_FILE_NAME = "players.json"
const ROLLS_FILE_NAME = "rolls.json"
const TURN_FILE_NAME = "turn.json"
function TURN_FOLDER_NAME(turn) { return `turn-${turn}` }

class PathToOld extends PathTo {  
  constructor(channelId, serverId, gameId) {
    super({ id: channelId, guild: { id: serverId } })
    this.base = path.join(process.cwd(), process.env.DATABASE_PATH)
    this.channelId = channelId
    this.serverId = serverId
    this.gameId = gameId
  }

  game() {
    const parentPath = this.channel()
    if (parentPath == null) return null
    return path.join(parentPath, PREVIOUS_GAME_FOLDER, this.gameId)
  }
}
module.exports = PathToOld

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