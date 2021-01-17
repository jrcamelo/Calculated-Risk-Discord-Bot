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
    return this;
  }

  createNew(channel) {
    this.id = channel.id;
    this.name = channel.name;
    this.server = channel.guild.name;
    this.game = null;
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

  // Utils

  getTurn(index=null) {
    if (this.game) {
      if (index <= this.game.currentTurn) {
        return this.game.getTurn(index);
      }
    }
    return null;
  }

  getPlayer(discordUser, index=null) {
    const turn = this.getTurn(index);
    if (turn) {
      return turn.getPlayer(discordUser);
    }
    return null;
  }
}