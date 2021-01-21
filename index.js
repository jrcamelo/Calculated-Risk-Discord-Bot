const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Calculating risks.'));
app.listen(port, () => console.log(`Staying alive at http://localhost:${port}`));
console.log("...")

const Bot = require("./Bot/Bot")
Bot.initialize()

const ReplitDatabase = require("@replit/database");
const db = new ReplitDatabase();


//db.delete("CHANNEL_796143378844483634");
//db.delete("CHANNEL_796143378844483634_BACKUP");
//db.delete("CHANNEL_undefined");


// db.get("CHANNEL_632916917966995457", {"raw":true}).then(function(result) {console.log(result);})
