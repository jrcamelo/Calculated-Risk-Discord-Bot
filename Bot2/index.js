require('dotenv').config()
const Discord = require("discord.js");
const WaitQueue = require("wait-queue")
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

client.on("message", async function(message) {
  queue.push(message)
})

client.once("ready", async function() {
  console.log("Connected!")
  await client.user.setActivity(`r.help`, { type: "PLAYING"});
  Parser.readCommands()
  console.log("Waiting for commands.")
  setImmediate(readFromQueue)
})

const queue = new WaitQueue()
async function readFromQueue() {
  queue.shift().then(async function(message) {
    await readMessage(message)
    setImmediate(readFromQueue);
  }).catch(function(e) {
    console.error("Error while reading queue", e);
    setImmediate(readFromQueue);
  });
}

async function readMessage(message) {
  try {
    if (await Parser.isValid(message)) {
      const command = new Parser(message).getCommand();
      if (command) {
        await command.tryExecute()
      }
    }
  } catch(e) {
    console.error("Error while reading message", e);
  }
}
