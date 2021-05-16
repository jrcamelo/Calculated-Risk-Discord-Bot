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



module.exports = {
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
}