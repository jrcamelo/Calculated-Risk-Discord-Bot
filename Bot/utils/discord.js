function getMentionedUser(message) {
  if (areThereMentions(message)) {
    return message.mentions.users.values().next().value;
  }
  return null;
}

function getMentionedUsers(message) {
  if (areThereMentions(message)) {
    return Array.from(message.mentions.users.values())
  }
  return null
}

function areThereMentions(message) {
  return (message &&
          message.mentions &&
          message.mentions.users &&
          message.mentions.users.size);
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

function makeMessageLinkFromIDs(channelId, messageId) {
  return `https://discord.com/channels/${channelId}/${messageId}`
}

function discordPingToUserID(text) {
  let regex = /<@!?(\d+)>/g;
  let match = regex.exec(text);
  if (match) {
    return match[1];
  }
  return null;
}

function makePing(player) {
  return `<@${player.id}>`;
}

function userIdtoDiscordPing(userId) {
  return `<@${userId}>`;
}

function ignoreDiscordMention(text) {
  let regex = /<@!?(\d+)>/g;
  return text.replace(regex, '');
}

function getMentionAndArg(text) {
  let regex = /<@!?(\d+)>/g;
  let match = regex.exec(text);
  if (match && match.length > 1) {
    return {
      id: match[1],
      mention: `<@${match[1]}>`,
      arg: text.replace(regex, '').trim()
    }
  }
  return null;
}

module.exports = {
  makeMessageLink,
  makeMessageLinkFromIDs,
  getMentionedUser,
  getMentionedUsers,
  getMessageAttachment,
  makePing,
  discordPingToUserID,
  userIdtoDiscordPing,
  ignoreDiscordMention,
  getMentionAndArg
}
