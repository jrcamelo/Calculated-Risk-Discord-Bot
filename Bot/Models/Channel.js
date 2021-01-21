const Bot = require("../Bot");
const Game = require("./Game");
const Utils = require("../Utils");

module.exports = class Channel {
  constructor() {
  }

  async get(channel) {
    const hash = await Bot.db.getChannel(channel.id);
    if (hash) {
      this.load(hash);
    } else {
      this.createNew(channel);
    }
    return this
  }

  load(hash) {
    this.id = hash.id;
    this.name = Utils.decode(hash.name);
    this.server = Utils.decode(hash.server);
    this.game = new Game().load(hash.game);
    return this;
  }

  encode() {
    this.name = Utils.encode(this.name);
    this.server = Utils.encode(this.server);
    if (this.game) {
      this.game.encode();
    }
  }

  createNew(channel) {
    this.id = channel.id;
    this.name = Utils.sanitize(channel.name);
    this.server = Utils.sanitize(channel.guild.name);
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