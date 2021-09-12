function cleanLineBreaks(text) {
  return text.replace(/(\r\n|\n|\r)/gm, "");
}

function timestampToDateTime(timestamp) {
  return new Date(timestamp).toUTCString();
}

function timestampToDate(timestamp) {
  return new Date(timestamp).toDateString();
}

function timestampToLocale(timestamp) {
  return new Date(timestamp).toLocaleDateString();
}

function idToChannelAndGameId(id) {
  const split = id.split("-");
  return {
    channelId: split[0],
    gameId: split[1]
  };
}

module.exports = {
  cleanLineBreaks,
  timestampToDate,
  timestampToDateTime,
  timestampToLocale,
  idToChannelAndGameId,
}