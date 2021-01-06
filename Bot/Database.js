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

  async getUser(discordId, channelId) {
    return await this.db.get(`USER_${discordId}_AT_CHANNEL_${channelId}`);
  }

  async addRoll(user, roll) {
    user.rolls.unshift(roll);
    return await this.db.set(user.key, user);
  }

  async getChannels() {
    return await this.db.list("CHANNEL_");
  }

  async getChannel(channelId, prefix = "CHANNEL_") {
    return await this.db.get(prefix + channelId);
  }

  async addChannel(channelId, roll, prefix = "CHANNEL_") {
    return await this.db.set(prefix + channelId, [roll]);
  }
}