const BaseCommand = require("../base_command")
const PathTo = require("../../database/pathto")
const { getSubFolders } = require("../../utils/file")
const fs = require("fs")
const path = require("path")

module.exports = class ClaimCommand extends BaseCommand {
  static aliases = ["CheckNeedRoll", "CheckGames", "NeedRoll", "iforgor"]
  static description = "Checks all channels for ongoing games that you haven't rolled"
  static argsDescription = ""
  static category = "Player"
  
  canDelete = true 
  needsGame = false
  
  getLatestTurn(filepath) {
    const subfolders = getSubFolders(filepath);
    return subfolders.sort().reverse()[0];
  }
  
  readPlayersFile(filepath) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  }

  getLatestPlayerData(serverFolderPath, channelId, userId) {
    const ongoingDir = path.join(serverFolderPath, channelId, 'ongoing');
    if (fs.existsSync(ongoingDir)) {
      const latestTurnDirName = this.getLatestTurn(ongoingDir);
      if (latestTurnDirName) {
        const playersFilePath = path.join(ongoingDir, latestTurnDirName, 'players.json');
        if (fs.existsSync(playersFilePath)) {
          const playersFileData = this.readPlayersFile(playersFilePath);
          return playersFileData[userId];
        }
      }
    }
    return null;
  }

  async execute() {
    let serverFolderPath = new PathTo({ id: "", guild: { id: this.serverId } }).server();

    if (fs.existsSync(serverFolderPath)) {
      const channelsWithUnrolled = [];
      const channels = getSubFolders(serverFolderPath);
    
      for (const channel of channels) {
        const playerData = this.getLatestPlayerData(serverFolderPath, channel, this.user.id);
        if (playerData && playerData.alive && !playerData.rolled) {
          channelsWithUnrolled.push(channel);
        }
      }
    
      if (!channelsWithUnrolled.length) {
        this.sendReply(`You don't have any ongoing game where you need to roll right now.`);
      } else {
        const channelMentions = channelsWithUnrolled.map(id => `\n<#${id}>`).join('');
        this.sendReply(`You have ongoing games where you need to roll in the following channels: ${channelMentions}`);
      }
    } else {
      console.log(`Server folder not found at path: ${serverFolderPath}`);
    }
  }
}