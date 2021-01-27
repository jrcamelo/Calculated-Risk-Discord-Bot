const IsImage = require("is-image-url")
const EmojiConverter = require("discord-emoji-converter");
const EmojiRegex = require("emoji-regex");
const Base32 = require("base32");
const Regenerate = require("regenerate");

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

function encode(str) {
  if (!str) return str;
  try {
    return Base32.encode(str);
  } catch(e) {
    console.log(str);
    console.log(e);
    return null;
  }
}

function decode(encoded) {
  if (!encoded) return encoded;
  try {
    return Base32.decode(encoded);
  } catch(e) {
    console.log(encoded);
    console.log(e);
    return null;
  }
}

function sanitize(str) {
  if (!str) {
    return str;
  }
  str = removeEmojis(str);

  let apostRegex = Regenerate("’").toRegExp();
  str = str.replace(apostRegex, "'");
  //str = str.replace(/&/g, "[!]");
  return str;
}

function removeEmojis(str) {
  let strCodify = "";
  try {
    strCodify = EmojiConverter.shortcodify(str);
    str = strCodify || str;
    return str.replace(EmojiRegex(), "[]");
  } catch(e) {
    str = strCodify || str || "";
    return str.replace(EmojiRegex(), "[]");
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

FUNNY_NUMBERS = ["69", "420", "69420", "42069", "1488", "1337", "80085", "8008135", "1350"]
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
module.exports.encode = encode;
module.exports.decode = decode;
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
