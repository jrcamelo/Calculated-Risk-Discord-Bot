const fse = require("fs-extra")
const { deserialize, serialize } = require("class-transformer")
const deserializeHash = require("../utils/deserialize_hash")

function read(path, classType, hash) {
  if (!exists(path)) return null
  if (classType == null) return console.error("Null class for " + path)
  try {
    const content = fse.readFileSync(path)
    if (hash)
      return deserializeHash(classType, content)
    else 
      return deserialize(classType, content)
  } catch(e) {
    console.error("Error while reading " + path, e)
    return null
  }
}

function readHash(path, classType) {
  return this.read(path, classType, true)
}

function write(path, content, cls) {
  try {
    makeBackup(path)
    const serialized = false
      ? serialize<cls>(content, { excludePrefixes: ["_"] })
      : serialize(content, { excludePrefixes: ["_"] })
    return fse.writeFileSync(path, serialized)
  } catch(e) {
    console.error("Error while writing file", e)
    if (restoreBackup(path))
      console.log("Backup restored")
  }
}

function createFolder(path) {
  return fse.mkdirSync(path)
}

function ensurePath(path) {
  return fse.mkdirsSync(path)
}

function exists(path) {
  return fse.existsSync(path)
}

function move(path, newPath) {
  return fse.moveSync(path, newPath)
}

function remove(path) {
  return fse.removeSync(path)
}

function makeBackup(path) {
  if (exists(path)) {
    fse.copyFileSync(path, path + ".backup")
    return true
  }
}

function restoreBackup(path) {
  if (exists(path + ".backup")) {
    fse.copyFileSync(path + ".backup", path)
    return true
  }
}

module.exports = { 
  read, 
  readHash,
  write, 
  createFolder,
  ensurePath, 
  exists,
  move,
  remove,
  makeBackup,
  restoreBackup,
};