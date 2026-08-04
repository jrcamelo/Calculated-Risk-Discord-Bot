const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("../utils/discord_compat")
const emotes = require("../utils/emotes")

const ACTIONS = {
  [emotes.previousReactionEmoji]: { id: "prev", label: "◀", style: ButtonStyle.Secondary },
  [emotes.nextReactionEmoji]: { id: "next", label: "▶", style: ButtonStyle.Secondary },
  [emotes.plusReactionEmoji]: { id: "expand", label: "More", style: ButtonStyle.Primary },
  [emotes.extrasReactionEmoji]: { id: "extras", label: "Details", style: ButtonStyle.Secondary },
  [emotes.stopEphemeralReactionEmoji]: { id: "unlock", label: "Keep Visible", style: ButtonStyle.Secondary },
  help_main: { id: "help-main", label: "Main", style: ButtonStyle.Secondary },
  help_player: { id: "help-player", label: "Player", style: ButtonStyle.Primary },
  help_master: { id: "help-master", label: "Master", style: ButtonStyle.Primary },
  help_level: { id: "help-level", label: "Level", style: ButtonStyle.Primary },
  help_util: { id: "help-util", label: "Util", style: ButtonStyle.Primary },
}

module.exports = class SlashComponents {
  static commands = new Map()
  static nextId = 1

  static register(command) {
    if (command._slashComponentId) return command._slashComponentId
    const id = String(this.nextId++)
    command._slashComponentId = id
    this.commands.set(id, command)
    setTimeout(() => this.commands.delete(id), 15 * 60 * 1000).unref?.()
    return id
  }

  static get(commandId) {
    return this.commands.get(commandId)
  }

  static remove(commandId) {
    return this.commands.delete(commandId)
  }

  static makeRows(command) {
    if (!command.reactions || !Object.keys(command.reactions).length) return []

    const commandId = this.register(command)
    const row = new ActionRowBuilder()
    for (const key of Object.keys(command.reactions)) {
      const action = this.makeAction(command, key)
      if (!action) continue
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`cr:${commandId}:${action.id}`)
          .setLabel(action.label)
          .setStyle(action.style)
      )
    }
    return row.components.length ? [row] : []
  }

  static makeAction(command, key) {
    const action = ACTIONS[key]
    if (!action) return null
    const label = command.getSlashButtonLabel?.(action.id, key) || action.label
    return { ...action, label }
  }

  static findReaction(command, actionId) {
    for (const [emote, meta] of Object.entries(ACTIONS)) {
      if (meta.id === actionId) return command.reactions[emote]
    }
  }

  static makeCollected(interaction) {
    return {
      user: interaction.user,
      users: { cache: new Map([[interaction.user.id, interaction.user]]) },
      message: interaction.message,
    }
  }
}
