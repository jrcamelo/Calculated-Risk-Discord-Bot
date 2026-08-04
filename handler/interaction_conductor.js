const WaitQueue = require("wait-queue")
const Parser = require("./parser")
const SlashMessageAdapter = require("./slash_message_adapter")
const SlashComponents = require("./slash_components")
const { makeEphemeralOptions } = require("../utils/discord_compat")

module.exports = class InteractionConductor {
  static channelQueues = {}

  static async onInteraction(interaction) {
    if (interaction.isChatInputCommand()) {
      await this.onSlashCommand(interaction)
    } else if (interaction.isButton()) {
      await this.onButton(interaction)
    }
  }

  static async onSlashCommand(interaction) {
    const adapter = new SlashMessageAdapter(interaction, interaction.commandName)
    try {
      const command = new Parser(adapter).getCommand()
      if (!command) {
        await adapter.sendEphemeral("Unknown command.")
        return
      }

      await command.prepare()
      const validationError = await command.validate()
      if (validationError) {
        await adapter.sendEphemeral(validationError)
        return
      }

      await interaction.deferReply(command.ephemeral ? makeEphemeralOptions() : {}).catch(() => null)
      const channelId = interaction.channelId || interaction.channel?.id || "global"
      this.addToChannelQueue(channelId, { interaction, adapter, command })
    } catch (e) {
      console.error(`/${interaction.commandName} caused an error while validating at ${new Date()}`, e)
      if (!interaction.deferred && !interaction.replied) {
        await adapter.sendEphemeral("There was an error while running this command.").catch(() => null)
      } else {
        await interaction.editReply("There was an error while running this command.").catch(() => null)
      }
    }
  }

  static addToChannelQueue(id, item) {
    if (!(id in InteractionConductor.channelQueues)) {
      InteractionConductor.channelQueues[id] = new WaitQueue()
      setImmediate(InteractionConductor.readChannelQueue, id)
    }
    InteractionConductor.channelQueues[id].push(item)
  }

  static async readChannelQueue(id) {
    InteractionConductor.channelQueues[id].shift().then(async item => {
      await InteractionConductor.handleSlashCommand(item)
      setImmediate(InteractionConductor.readChannelQueue, id)
    }).catch(e => {
      console.error("Error while reading interaction queue: " + id, e)
      setImmediate(InteractionConductor.readChannelQueue, id)
    })
  }

  static async handleSlashCommand(item) {
    const { interaction, adapter, command } = item
    try {
      await command.execute()
    } catch (e) {
      console.error(`/${interaction.commandName} caused an error at ${new Date()}`, e)
      await interaction.editReply("There was an error while running this command.").catch(() => null)
    }
  }

  static async onButton(interaction) {
    const [prefix, commandId, actionId] = interaction.customId.split(":")
    if (prefix !== "cr") return

    const command = SlashComponents.get(commandId)
    if (!command || !command.valid) {
      return interaction.reply(makeEphemeralOptions({ content: "This control expired." })).catch(() => null)
    }
    if (interaction.user.id !== command.user.id) {
      return interaction.reply(makeEphemeralOptions({ content: "This control is not yours." })).catch(() => null)
    }

    const callback = SlashComponents.findReaction(command, actionId)
    if (!callback) return interaction.deferUpdate().catch(() => null)

    try {
      await interaction.deferUpdate().catch(() => null)
      const collected = SlashComponents.makeCollected(interaction)
      await callback(collected, command)
    } catch (e) {
      console.error("Error while handling component interaction", e)
    }
  }
}
