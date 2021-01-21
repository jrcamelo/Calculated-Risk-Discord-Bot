const IsImage = require("is-image-url")
const EmojiConverter = require("discord-emoji-converter");

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

function isImage(url) {
  return IsImage(url);
}

function sanitize(str) {
  if (!str) {
    return str;
  }
  str = removeEmojis(str);
  str = str.replace(/;/g, "[,]");
  str = str.replace(/&/g, "[!]");
  return str;
}

function removeEmojis(str) {
  try {
    return EmojiConverter.shortcodify(str);
  } catch(e) {
    var unified_emoji_ranges = [
      '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
      '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
      '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
    ];
    str = str || "";
    var regex = new RegExp(unified_emoji_ranges.join('|'), 'g');
    return str.replace(regex, "[?]");
  }
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

function lastCharacters(str, index) {
  const fromEnd = str.length - index;
  return str.substring(fromEnd, str.length)
}

function findRepeatedSize(str) {
  let repeated = 1;
  for (var i = str.length - 2; i >= 0; i--) {
    if (str[i] == str[str.length - 1]) {
      repeated += 1
    } else {
      break;
    }
  }
  if (repeated > 1) {
    return repeated;
  }
  return 0;
}

function findPalindromeSize(str) {
  for (var i = str.length; i >= 3; i--) {
    if (isPalindrome(lastCharacters(str, i))) {
      return i;
    }
  }
  return 0;
}

function findStraightSize(str) {
  for (var i = str.length; i >= 3; i--) {
    if (isStraight(lastCharacters(str, i)) ||
        isReverseStraight(lastCharacters(str, i))) {
      return i;
    }
  }
  return 0;
}

FUNNY_NUMBERS = ["69", "420", "69420", "42069", "1488", "1337", "80085", "8008135"]
function findFunnyNumberSize(str) {
  for (let funny of FUNNY_NUMBERS) {
    if (str.endsWith(funny)) {
      return funny.length;
    }
  }
  return 0;
}

function isPalindrome(str) {
  var len = Math.floor(str.length / 2);
  for (var i = 0; i < len; i++)
    if (str[i] !== str[str.length - i - 1])
      return false;
  return true;
}

function isStraight(str) {
  for (var i = 0; i < str.length - 1; i++) {
    let current = +str[i] || 10;
    let next = +str[i+1] || 10;
    if (current + 1 != next) {
      return false;
    }
  }
  return true;
}

function isReverseStraight(str) {
  for (var i = 0; i < str.length - 1; i++) {
    let current = +str[i] || 10;
    let next = +str[i+1] || 10;
    if (current - 1 != next) {
      return false;
    }
  }
  return true;
}



module.exports.times = times;
module.exports.keepOnlyNumbers = keepOnlyNumbers;
module.exports.isImage = isImage;
module.exports.sanitize = sanitize;
module.exports.removeEmojis = removeEmojis;
module.exports.makeMessageLink = makeMessageLink;
module.exports.timestampToDate = timestampToDate;
module.exports.timestampToDateTime = timestampToDateTime;
module.exports.splice = splice;
module.exports.spliceFromEnd = spliceFromEnd;
module.exports.findPalindromeSize = findPalindromeSize;
module.exports.findRepeatedSize = findRepeatedSize;
module.exports.findStraightSize = findStraightSize;
module.exports.findFunnyNumberSize = findFunnyNumberSize;
module.exports.isPalindrome = isPalindrome;
module.exports.isStraight = isStraight;
module.exports.isReverseStraight = isReverseStraight;
module.exports.lastCharacters = lastCharacters;
