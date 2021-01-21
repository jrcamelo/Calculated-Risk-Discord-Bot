const ReplitDatabase = require("@replit/database");

module.exports = class Database {
  constructor() {
    this.db = new ReplitDatabase();
  }

  // For tests
  async getAll() {
    return await this.db.getAll();
  }

  async get(id) {
    return await this.db.get(id);
  }

  async getChannel(channelId, prefix="CHANNEL_") {
    return await this.db.get(prefix + channelId);
  }

  async saveChannel(channel, prefix="CHANNEL_") {
    await this.trySaveChannelBackup(channel);
    return await this.db.set(prefix + channel.id, channel);
  }

  async trySaveChannelBackup(channel) {
    try {
      const old = await this.db.get("CHANNEL_" + channel.id);
      if (old != null) {
        await this.db.set("CHANNEL_" + channel.id + "_BACKUP", old);
      }
    } catch(e) {
      console.log(e);
    }
  }

  async savePrefix(serverId, commandPrefix, prefix="SERVER_") {
    return await this.db.set(prefix + serverId, commandPrefix);
  }

  async getPrefix(serverId, prefix="SERVER_") {
    return await this.db.get(prefix + serverId);
  }

  async getChannels() {
    return await this.db.list("CHANNEL_");
  }
}