const emotes = require("./emotes")

function randomNumber(min=0, max=10000000000) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
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

FUNNY_NUMBERS = ["69420", "42069", "1488", "1337", "80085", "8008135", "80084", "69", "420", "1984"]
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
    let current = +str[i];
    let next = +str[i+1];
    if ((current + 1) % 10 != next) {
      return false;
    }
  }
  return true;
}

function isReverseStraight(str) {
  for (var i = 0; i < str.length - 1; i++) {
    let current = +str[i] || 10;
    let next = +str[i+1];
    if (current - 1 != next) {
      return false;
    }
  }
  return true;
}

// Parse a DnD roll notation string into numbers
// e.g. "2d6+3" -> { "multiple": 2, "limit": 6, "modifier": 3 }
// e.g. "2d6-3" -> { "multiple": 2, "limit": 6, "modifier": -3 }
// e.g. "2d6" -> { "multiple": 2, "limit": 6, "modifier": 0 }
// e.g. "d6" -> { "multiple": 1, "limit": 6, "modifier": 0 }
function getMultipleLimitModifierFromDnD(roll) {
  if (!roll) return
  const regex = /^(\d+)?d(\d+)(\+)?(\d+)?(\-)?(\d+)?$/
  const matches = roll.match(regex)
  if (matches == null) return
  const multiple = +matches[1] || 1
  const limit = +matches[2]
  const modifier = matches[3] ? +matches[4] : (matches[5] ? -matches[6] : 0)
  return { multiple, limit, modifier }
}

function calculateScore(repeated, palindrome, straight, funny, rollValue) {
  let score = 0;
  if (repeated) score += repeated
  if (palindrome) score += palindrome - 1
  if (straight) score += straight - 1
  if (funny) score += funny - 1
  score *= 100

  const rollLastDigit = +(rollValue.slice(-1)) || 10;
  score += rollLastDigit * 10
  return score
}

function getEmote(value, score) {
  const special = emotes.rolls[+value]
  if (special) return special

  if (score > 1000)
    return emotes.score[">1000"]
  return null
}

module.exports = {
  randomNumber,
  splice,
  spliceFromEnd,
  findPalindromeSize,
  findRepeatedSize,
  findStraightSize,
  findFunnyNumberSize,
  isPalindrome,
  isStraight,
  isReverseStraight,
  lastCharacters,
  getMultipleLimitModifierFromDnD,
  calculateScore,
  getEmote
}