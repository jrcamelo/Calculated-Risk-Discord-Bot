const { Collection, makeEphemeralOptions } = require("../utils/discord_compat")
const { buildLegacyArgs, getAttachment } = require("./slash_option_mappings")

class SlashReply {
  constructor(adapter, message) {
    this.adapter = adapter
    this.message = message
    this.id = message?.id
    this.reactions = {
      removeAll: async () => this.edit({ components: [] }),
    }
  }

  async edit(content) {
    const message = await this.adapter.editReply(content)
    this.message = message || this.message
    return this
  }

  async delete() {
    await this.adapter.deleteReply()
  }

  async react(emoji) {
    if (!this.message?.react) return null
    return this.message.react(emoji).catch(() => null)
  }

  awaitReactions() {
    return Promise.reject(new Error("Slash replies use buttons, not reactions."))
  }
}

module.exports = class SlashMessageAdapter {
  constructor(interaction, commandName) {
    this.interaction = interaction
    this.client = interaction.client
    this.author = interaction.user
    this.user = interaction.user
    this.member = interaction.member
    this.id = interaction.id
    this.limitDelete = false
    this._isSlashCommand = true
    this._hasPrimaryReply = false

    const syntheticArgs = buildLegacyArgs(commandName, interaction)
    this._attachment = getAttachment(interaction, commandName)
    this.content = `${process.env.PREFIX || "."}${commandName}${syntheticArgs ? ` ${syntheticArgs}` : ""}`

    this.channel = this.makeChannel(interaction.channel)
    this.guild = interaction.guild
    this.attachments = this.makeAttachments()
    this.mentions = { users: this.makeMentionUsers(syntheticArgs) }
  }

  makeChannel(channel) {
    const adapted = Object.create(channel)
    adapted.id = channel.id
    adapted.name = channel.name
    adapted.guild = this.interaction.guild
    adapted.send = async (content, options) => this.send(content, options)
    return adapted
  }

  makeAttachments() {
    const attachments = new Collection()
    if (this._attachment) attachments.set(this._attachment.id, this._attachment)
    return attachments
  }

  makeMentionUsers(args) {
    const users = new Collection()
    for (const user of this.interaction.options.resolved?.users?.values?.() || []) {
      users.set(user.id, user)
    }
    const regex = /<@!?(\d{17,20})>|\b(\d{17,20})\b/g
    let match
    while ((match = regex.exec(args || ""))) {
      const id = match[1] || match[2]
      const user = users.get(id) || this.client.users.cache.get(id) || { id, username: id, toString: () => `<@${id}>` }
      users.set(id, user)
    }
    return users
  }

  async react() {
    return null
  }

  async send(content, options) {
    const payload = this.normalizePayload(content, options)
    let message
    if (!this._hasPrimaryReply) {
      if (this.interaction.deferred) {
        message = await this.interaction.editReply(payload)
      } else if (!this.interaction.replied) {
        await this.interaction.reply(payload)
        message = await this.interaction.fetchReply()
      } else {
        message = await this.interaction.followUp(payload)
      }
      this._hasPrimaryReply = true
    } else {
      message = await this.interaction.followUp(payload)
    }
    return new SlashReply(this, message)
  }

  async sendEphemeral(content, options = {}) {
    return this.send(content, makeEphemeralOptions(options))
  }

  async editReply(content) {
    return await this.interaction.editReply(this.normalizePayload(content))
  }

  async deleteReply() {
    try {
      await this.interaction.deleteReply()
    } catch (_e) {
      if (this.interaction.message?.delete) await this.interaction.message.delete()
    }
  }

  normalizePayload(content, options = {}) {
    const payload = { ...options }
    if (payload.ephemeral) Object.assign(payload, makeEphemeralOptions(payload))
    if (Array.isArray(content)) {
      payload.embeds = content
    } else if (content && typeof content.toJSON === "function") {
      payload.embeds = [content]
    } else if (content && typeof content === "object" && !Buffer.isBuffer(content)) {
      Object.assign(payload, content)
    } else if (content !== undefined && content !== null) {
      payload.content = String(content)
    }
    return payload
  }
}
