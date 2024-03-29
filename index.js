require('dotenv').config()
const Discord = require("discord.js");
const Conductor = require("./handler/conductor")
const Parser = require("./handler/parser")
const BotInfo = require("./utils/bot_info")

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
  BotInfo.set(client)

  // migrate(client)
})

client.on("message", Conductor.onNewMessage)



function migrate(client) {
  const Migrator = require("./migration/migrate_old_database")
  const serverKeys = client.guilds.cache.keys()
  const channelsToServerIds = {}
  for (const serverKey of serverKeys) {
    const channels = client.guilds.cache.get(serverKey).channels.cache.keys()
    for (const channel of channels) {
      channelsToServerIds[channel] = serverKey
    }
  }
  const migrator = new Migrator("./migration/storage.json", "./migration/storage/", channelsToServerIds)
  migrator.migrate()
}