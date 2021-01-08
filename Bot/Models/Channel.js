const Bot = require("../Bot");
const Game = require("./Game");

module.exports = class Channel {
  constructor() {
  }

  async get(channel) {
    const hash = await Bot.db.getChannel(channel.id);
    if (hash != null) {
      this.load(hash);
    } else {
      this.createNew(channel);
    }
    return this
  }

  load(hash) {
    this.id = hash.id;
    this.name = hash.name;
    this.server = hash.server;
    this.game = new Game().load(hash.game);
    this.prefix = hash.prefix;
    return this;
  }

  createNew(channel) {
    this.id = channel.id;
    this.name = channel.name;
    this.server = channel.guild.name;
    this.game = null;
    this.prefix = "r.";
    return this;
  }

  async save() {
    Bot.db.saveChannel(this)
  }

  createNewGame(master, name) {
    this.game = new Game().create(master, name);  
  }

  finishGame() {
    if (this.game == null) {
      return;
    } 
    this.game.finish();
    const game = this.game;   
    this.game = null;
    return game;
  }
}