function getMentionedUser(message) {
  if (message.mentions && 
      message.mentions.users &&
      message.mentions.users.size) {
    return message.mentions.users.values().next().value;
  }
  return null;
}

function getMessageAttachment(message) {
  if (message.attachments.size > 0) {
    return message.attachments.values().next().value.url;
  }
  return null;
}

function makeMessageLink(message) {
  return `https://discord.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id}`
}

module.exports = {
  makeMessageLink,
  getMentionedUser,
  getMessageAttachment,
}
