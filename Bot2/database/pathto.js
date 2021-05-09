require("dotenv").config();
const path = require("path")

class PathTo {  
  constructor(message) {
    this.base = process.env.DATABASE_PATH
    if (message != null && message.channel != null && message.channel.guild != null) {
      this.channelId = message.channel.id
      this.serverId = message.channel.guild.id
    }
  }

  channel() {
    if (this.serverId == null || this.channelId == null) return null
    return path.join(this.base, "servers", this.serverId, this.channelId)
  }

  game() {
    const parentPath = this.channel()
    if (parentPath == null) return null
    return path.join(parentPath, "ongoing")
  }

  gameFile() {
    const parentPath = this.game()
    if (parentPath == null) return null
    return path.join(parentPath, "game.json")
  }

  turnFile(turn="current") {
    const parentPath = this.game()
    if (parentPath == null) return null
    return path.join(parentPath, `turn-${turn}.json`)
  }
}
module.exports = PathTo