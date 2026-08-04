require('dotenv').config()
const Discord = require("./utils/discord_compat");
const Conductor = require("./handler/conductor")
const InteractionConductor = require("./handler/interaction_conductor")
const Parser = require("./handler/parser")
const BotInfo = require("./utils/bot_info")

const intents = [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessageReactions,
]

if (process.env.ENABLE_PREFIX_COMMANDS === "true") {
  intents.push(Discord.GatewayIntentBits.GuildMessages)
  intents.push(Discord.GatewayIntentBits.MessageContent)
}

const client = new Discord.Client({ intents })

console.log("Connecting to Discord")
client.login(process.env.BOT_TOKEN).catch(console.error)


client.once(Discord.Events.ClientReady, async function() {
  console.log("Connected!")
  await client.user.setActivity(`/help`, { type: Discord.ActivityType.Playing});
  Parser.readCommands()
  Conductor.enable()
  BotInfo.set(client)

  // migrate(client)
})

client.on("messageCreate", Conductor.onNewMessage)
client.on(Discord.Events.InteractionCreate, InteractionConductor.onInteraction.bind(InteractionConductor))



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
