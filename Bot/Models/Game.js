

module.exports = class Game {
  constructor(userId, name) {
    this.name = name
    this.master = userId
    this.turn = 0
    this.mups = []
    this.players = {}
  }
  
}