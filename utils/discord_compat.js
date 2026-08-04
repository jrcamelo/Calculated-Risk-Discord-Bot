const Discord = require("discord.js")
const EPHEMERAL_FLAG = Discord.MessageFlags?.Ephemeral ?? 64

function makeEphemeralOptions(options = {}) {
  const payload = { ...options }
  delete payload.ephemeral
  payload.flags = payload.flags === undefined ? EPHEMERAL_FLAG : payload.flags
  return payload
}

// Keep the legacy command/presenter code running on discord.js v14.
if (!Discord.MessageEmbed && Discord.EmbedBuilder) {
  Discord.MessageEmbed = class MessageEmbed extends Discord.EmbedBuilder {
    constructor(data) {
      super(data && typeof data.toJSON === "function" ? data.toJSON() : data)
    }

    setAuthor(nameOrOptions, iconURL, url) {
      if (!nameOrOptions) return this
      if (typeof nameOrOptions === "string") {
        const options = { name: nameOrOptions }
        if (iconURL) options.iconURL = iconURL
        if (url) options.url = url
        return super.setAuthor(options)
      }
      return super.setAuthor(nameOrOptions)
    }

    setFooter(textOrOptions, iconURL) {
      if (!textOrOptions) return this
      if (typeof textOrOptions === "string") {
        const options = { text: textOrOptions }
        if (iconURL) options.iconURL = iconURL
        return super.setFooter(options)
      }
      return super.setFooter(textOrOptions)
    }

    get title() {
      return this.data.title
    }

    get description() {
      return this.data.description
    }

    get fields() {
      return this.data.fields
    }

    get footer() {
      return this.data.footer
    }

    get image() {
      return this.data.image
    }

    get thumbnail() {
      return this.data.thumbnail
    }
  }
}

if (!Discord.MessageAttachment && Discord.AttachmentBuilder) {
  Discord.MessageAttachment = class MessageAttachment extends Discord.AttachmentBuilder {
    constructor(attachment, nameOrData) {
      super(attachment, typeof nameOrData === "string" ? { name: nameOrData } : nameOrData)
    }
  }
}

module.exports = Discord
module.exports.makeEphemeralOptions = makeEphemeralOptions
module.exports.EPHEMERAL_FLAG = EPHEMERAL_FLAG
