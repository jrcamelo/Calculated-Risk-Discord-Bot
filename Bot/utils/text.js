const Base32 = require("base32");


function cleanLineBreaks(text) {
  return text.replace(/(\r\n|\n|\r)/gm, "");
}

function timestampToDateTime(timestamp) {
  return new Date(timestamp).toUTCString();
}

function timestampToDate(timestamp) {
  return new Date(timestamp).toDateString();
}

module.exports = {
  cleanLineBreaks,
  timestampToDate,
  timestampToDateTime,
}