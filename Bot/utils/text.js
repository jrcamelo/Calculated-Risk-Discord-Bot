const IsImage = require("is-image-url")
const EmojiConverter = require("discord-emoji-converter");
const EmojiRegex = require("emoji-regex");
const Base32 = require("base32");
const Regenerate = require("regenerate");


function cleanLineBreaks(text) {
  return text.replace(/(\r\n|\n|\r)/gm, "");
}

function keepOnlyNumbers(text) {
  return text.replace(/\D/g,'');
}

function isImage(url) {
  return IsImage(url);
}

function encode(str) {
  if (!str) return str;
  try {
    return Base32.encode(encode_utf8(str));
  } catch(e) {
    console.log(str);
    console.log(e);
    return null;
  }
}

function decode(encoded) {
  if (!encoded) return encoded;
  try {
    return decode_utf8(Base32.decode(encoded));
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

function encode_utf8(s) {
  try {
    return unescape(encodeURIComponent(s));
  } catch {
    return s
  }
}

function decode_utf8(s) {
  try {
    return decodeURIComponent(escape(s));
  } catch {
    return s
  }
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

module.exports = {
  cleanLineBreaks,
  keepOnlyNumbers,
  isImage,
  encode,
  decode,
  sanitize,
  removeEmojis,
  timestampToDate,
  timestampToDateTime,
}