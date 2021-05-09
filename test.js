require("dotenv").config();

const Database = require("./Bot2/database/")

const message = {channel: {id: "channel", guild: { id: "guild"}}}
const game = {game: "Game?"}
const turn = {"number": 1}

const db = new Database(message)
//db.saveGame(game)
db.getGame()
db.saveTurn(turn)