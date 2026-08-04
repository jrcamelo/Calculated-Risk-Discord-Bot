require("dotenv").config()
require("../utils/discord_compat")

const { REST, Routes, SlashCommandBuilder } = require("discord.js")
const { requireCommands } = require("../utils/file")
const { addOptions } = require("../handler/slash_option_mappings")
const { DESCRIPTIONS, slashDescription } = require("../handler/slash_descriptions")

const SLASH_EXCLUDED_PRIMARY_NAMES = new Set([
  "gif",
  "pizzaroll",
  "attackwithmysword",
  "pong",
  "troll",
  "whacksorryass",
  "right",
])

function commandName(commandType) {
  return commandType.aliases[0].toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 32)
}

function buildCommands() {
  const seen = new Set()
  const commands = []

  for (const commandType of requireCommands()) {
    if (!commandType.aliases || !commandType.aliases.length) continue
    const name = commandName(commandType)
    if (SLASH_EXCLUDED_PRIMARY_NAMES.has(name)) continue
    if (seen.has(name)) throw new Error(`Duplicate slash command name: ${name}`)
    if (!/^[\w-]{1,32}$/.test(name)) throw new Error(`Invalid slash command name: ${name}`)
    seen.add(name)

    const slashCommand = new SlashCommandBuilder()
      .setName(name)
      .setDescription(slashDescription(name, commandType))
    addOptions(slashCommand, name)
    commands.push(slashCommand.toJSON())
  }

  if (commands.length > 100) {
    throw new Error(`Discord allows 100 global chat-input commands; generated ${commands.length}.`)
  }
  return commands
}

async function main() {
  const token = (process.env.BOT_TOKEN || "").trim()
  const clientId = (process.env.CLIENT_ID || deriveClientIdFromToken(token) || "").trim()
  const guildId = process.env.DEV_GUILD_ID
  if (!token) throw new Error("BOT_TOKEN is required.")
  if (!clientId) throw new Error("CLIENT_ID is required.")

  const rest = new REST({ version: "10" }).setToken(token)
  const isGuildDeploy = process.argv.includes("--guild")
  const isClearGuild = process.argv.includes("--clear-guild")

  if ((isGuildDeploy || isClearGuild) && !guildId) {
    throw new Error("DEV_GUILD_ID is required for guild command deployment.")
  }

  if (isClearGuild) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
    console.log(`Cleared guild slash commands in guild ${guildId}.`)
    return
  }

  const commands = buildCommands()
  const route = isGuildDeploy
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId)

  await rest.put(route, { body: commands })
  console.log(`Registered ${commands.length} slash commands${guildId && isGuildDeploy ? ` in guild ${guildId}` : " globally"}.`)
}

function deriveClientIdFromToken(token) {
  if (!token || !token.includes(".")) return null
  try {
    const firstPart = token.split(".")[0]
    return Buffer.from(firstPart, "base64").toString("utf8")
  } catch (_e) {
    return null
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(error)
    process.exit(1)
  })
}

module.exports = { buildCommands, deriveClientIdFromToken, DESCRIPTIONS }
