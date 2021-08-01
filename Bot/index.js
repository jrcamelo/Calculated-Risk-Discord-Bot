require('dotenv').config()
const Discord = require("discord.js");
const Conductor = require("./handler/conductor")
const Parser = require("./handler/parser")

const client = new Discord.Client({ 
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
  ] 
})

console.log("Connecting to Discord")
client.login(process.env.BOT_TOKEN).catch(console.error)


client.once("ready", async function() {
  console.log("Connected!")
  await client.user.setActivity(`r.help`, { type: "PLAYING"});
  Parser.readCommands()
  Conductor.enable()
  console.log("Waiting for commands.")
})

client.on("message", Conductor.onNewMessage)
