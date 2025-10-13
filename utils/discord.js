function getMentionedUser(message) {
  if (areThereMentions(message)) {
    return message.mentions.users.values().next().value || getRawMentionedUser(message);
  }
}

function getRawMentionedUser(message) {
  const id = extractRawIdMention(message)
  return id ? message.client.users.cache.get(id) || null : null;
}

function getMentionedUsers(message) {
  if (areThereMentions(message)) {
    return Array.from(message.mentions.users.values()) || getRawMentionedUsers(message)
  }
}

function getRawMentionedUsers(message) {
  const id = extractRawIdMention(message);
  return id ? [message.client.users.cache.get(id)].filter(Boolean) : null;
}

function areThereMentions(message) {
  return (
    (message &&
      message.mentions &&
      message.mentions.users &&
      message.mentions.users.size) ||
    extractRawIdMention(message)
  );
}

function extractRawIdMention(message) {
  const parts = message.content.trim().split(/\s+/);
  if (parts.length >= 2 && /^\d{17,20}$/.test(parts[1])) {
    return parts[1];
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
  return `<@!${player.id}>`;
}

function userIdtoDiscordPing(userId) {
  return `<@!${userId}>`;
}

function ignoreDiscordMention(text) {
  let regex = /<@!?(\d+)>/g;
  return text.replace(regex, '');
}

function getMentionAndArg(text) {
  let regex = /(?:<@!?(\d+)>|(\b\d{17,20}\b))/;
  let match = regex.exec(text);
  if (match) {
    let id = match[1] || match[2];
    return {
      id,
      mention: `<@${id}>`,
      arg: text.replace(regex, '').trim()
    };
  }
  return null;
}

function channelMention(channelId) {
  return `<#${channelId}>`;
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
  getMentionAndArg,
  channelMention,
}
