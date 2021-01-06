const Bot = require("../Bot");


module.exports = class Channel {
  constructor() {
    this.client = Bot.client;
    this.db = Bot.db;
  }

  async get(channel) {
    hash = await this.db.getChannel(message.channel.id);
    console.log(hash)
    if (hash != null) {
      this.loadFromHash(hash);
    } else {
      this.createNewFromChannel(channel);
    }
    console.log(this)
    return this
  }

  loadFromHash(hash) {
    this.id = hash.id;
    this.name = hash.name;
    this.server = hash.server;
    this.game = hash.game;
    this.oldGames = hash.oldGames;
    this.prefix = hash.prefix;
  }

  createNewFromChannel(channel) {
    this.id = channel.id;
    this.name = channel.name;
    this.server = channel.guild.name;
    this.game = null;
    this.oldGames = [];
    this.prefix = "r.";
  }  
}