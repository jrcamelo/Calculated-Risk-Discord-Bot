const Discord = require("discord.js")
const Database = require("../database")
const Turn = require("./turn")
const TextUtils = require("../utils/text")

module.exports = class Game {
  constructor(database, name, master, turnNumber = 0, startedAt = Date.now(), endedAt = null) {
    this.database = database
    this.name = TextUtils.sanitize(name)
    this.master = master
    this.turnNumber = turnNumber
    this.startedAt = startedAt
    this.endedAt = endedAt
    this.turn = Turn.load(database)
  }

  static load(database) {
    const hash = database.getGame()
    if (!hash) return null
    const { name, master, turnNumber, startedAt, endedAt } =  hash
    return Game(
      database,
      TextUtils.decode(name),
      master,
      turnNumber,
      startedAt,
      endedAt,
    )
  }

  save() {
    const hash = {
      name: TextUtils.encode(this.name),
      master: this.master.toHash(),
      turnNumber: this.turnNumber,
      startedAt: this.startedAt,
      endedAt: this.endedAt
    }
    this.database.saveGame(hash)
    this.turn.save()
  }

  nextTurn(mup, description) {
    this.turnNumber += 1
    this.turn = Turn.fromPreviousTurn(database, this.turn, mup, description)
    this.database.saveNewTurn(this.turn)
  }
}