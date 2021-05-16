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

const wq = new WaitQueue();
async function readFromQueue() {
  // put first element out of queue
  wq.shift().then(async function(item) {
      console.log(item);
      // do next loop
      await sleep(200)
      setImmediate(readFromQueue);
    })
    .catch(function(e) {
      console.error('error', e);
      setImmediate(readFromQueue);
    });
}
setImmediate(loop);
 

function sleep(ms) {
  return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
} 

var taskID = 0;
var interval;
// add a task every 1s
interval = setInterval(function() {
  if (taskID < 10)
    wq.push({
      taskid: taskID++,
    });
  else {
    taskID++
    if (taskID > 30) {
      console.log(1)
      wq.push({
        taskid: taskID++,
      });
    }
  }
}, 100);
