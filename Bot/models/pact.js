module.exports = Pact
class Pact {
  constructor(target, turn, time=Date.now()) {
    this.target = target
    this.turn = turn
    this.time = time
  }
}