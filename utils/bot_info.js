module.exports = class BotInfo {
  static botUser = ""
  static botAvatar = ""

  static botOwner = ""
  static botOwnerAvatar = ""

  static async set(client) {
    BotInfo.botUser = client.user.username
    BotInfo.botAvatar = await client.user.avatarURL()
    const owner = await client.users.fetch(process.env.OWNER)
    BotInfo.botOwner = owner.tag
    BotInfo.botOwnerAvatar = owner.avatarURL()
  }
}