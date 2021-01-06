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
    this.oldGames = hash.oldGames;
    this.prefix = hash.prefix;
  }

  createNew(channel) {
    this.id = channel.id;
    this.name = channel.name;
    this.server = channel.guild.name;
    this.game = null;
    this.oldGames = [];
    this.prefix = "r.";
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
    this.oldGames.unshift(this.game);
    this.game = null;
    return game;
  }


}