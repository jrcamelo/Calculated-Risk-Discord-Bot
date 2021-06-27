require('dotenv').config()
const Discord = require("discord.js-commando");
const Conductor = require("./handler/conductor")
const Parser = require("./handler/parser")

const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'], 
  intents: ['GUILDS', 'GUILD_WEBHOOKS', 'GUILD_MESSAGES', 'GUILD_INTEGRATIONS'],
  allowedMentions: { 
    parse: ['users', 'roles', 'everyone'], 
    repliedUser: true
  } 
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
