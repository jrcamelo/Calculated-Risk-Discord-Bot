const times = {
  SECONDS: 1,
  MINUTES: 60,
  HOURS: 60*60,
  DAYS: 60*60*24,
  YEARS: 60*60*24*365
}

function keepOnlyNumbers(text) {
  return text.replace(/\D/g,'');
}

function makeMessageLink(message) {
  return `https://discord.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id}`
}

function timestampToDateTime(timestamp) {
  return new Date(timestamp).toUTCString();
}

function timestampToDate(timestamp) {
  return new Date(timestamp).toDateString();
}

function splice(str, index, stringToAdd){
  return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

function spliceFromEnd(str, index, stringToAdd) {
  const fromEnd = str.length - index;
  return str.substring(0, fromEnd) + stringToAdd + str.substring(fromEnd, str.length);
}


module.exports.times = times;
module.exports.keepOnlyNumbers = keepOnlyNumbers;
module.exports.makeMessageLink = makeMessageLink;
module.exports.timestampToDate = timestampToDate;
module.exports.timestampToDateTime = timestampToDateTime;
module.exports.splice = splice;
module.exports.spliceFromEnd = spliceFromEnd;
