// require("dotenv").config();

// const Database = require("./Bot2/database/")

// const message = {channel: {id: "channel", guild: { id: "guild"}}}
// const game = {game: "Game?"}
// const turn = {"number": 1}

// const db = new Database(message)
// //db.saveGame(game)
// db.getGame()
// db.saveTurn(turn)

const WaitQueue = require("wait-queue");

const queues = {}
async function readQueue(i) {
  queues[i.toString()].shift().then(async function(item) {
    console.log(item);
    await sleep(item * 100)
    setImmediate(readQueue, i);
  })
  .catch(function(e) {
    console.error('error', e);
    setImmediate(readQueue, i);
  });
}

function length() {
  return +Object.keys(queues).length
}

function addAndStartQueue() {
  queues[+length()] = new WaitQueue()
  readQueue(+length() - 1)
}
 

function sleep(ms) {
  return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}


function randomPopulate() {
  addAndStartQueue()
  if (length() > 1) {
    let i = randomNumber(0, +length() - 1)
    queues[i.toString()].push(i)
  }
}


function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const interval = setInterval(function() {
  randomPopulate()
}, 0.1);