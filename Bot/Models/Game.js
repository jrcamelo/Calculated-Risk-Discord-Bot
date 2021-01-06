const User = require("./User");

module.exports = class Game {
  create(user, name) {    
    this.name = name;
    this.master = new User().create(user);
    this.turn = 0;
    this.mups = [];
    this.players = {};
    this.startedAt = Date.now();
    this.endedAt = null;
    return this;
  }
  
  load(hash) {
    if (!hash) {
      return null;
    }
    this.name = hash.name;
    this.master = new User().load(hash.master);
    this.turn = hash.turn;
    this.mups = hash.mups;
    this.players = hash.players;
    this.startedAt = hash.startedAt;
    this.endedAt = hash.endedAt;
    return this;
  }
  
  finish() {
    this.endedAt = Date.now();
  }
}