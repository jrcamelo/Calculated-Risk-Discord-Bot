const { deserialize } = require('class-transformer');

module.exports = function deserializeHash(cls, json, options) {
  const result = {}
  const hash = deserialize(null, json, options)
  for (const [key, value] of Object.entries(hash)) {
    result[key] = deserialize(cls, JSON.stringify(value), options)
  }
  return result
}