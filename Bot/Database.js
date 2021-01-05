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

  async getUsers() {
    return await this.db.list("USER_");
  }

  async getUser(discordId, prefix = "USER_") {
    return await this.db.get(prefix + discordId)
  }

  async addUser(discordId, roll, prefix = "USER_") {
    return await this.db.set(prefix + discordId, [roll])
  }

  async getChannels() {
    return await this.db.list("CHANNEL_");
  }

  async getChannel(channelId, prefix = "CHANNEL_") {
    return await this.db.get(prefix + channelId)
  }

  async addChannel(channelId, roll, prefix = "CHANNEL_") {
    return await this.db.set(prefix + channelId, [roll])
  }
}