const fse = require("fs-extra")
const transformer = require("class-transformer")

function read(path, classType) {
  if (!exists(path)) return null
  if (classType == null) return console.error("Null class for " + path)
  try {
    const content = fse.readJSONSync(path)
    return transformer.deserialize(classType, content)
  } catch(e) {
    console.error("Error while reading " + path, e)
    return null
  }
}

function write(path, content) {
  try {
    makeBackup(path)
    const serialized = transformer.serialize(content, { excludePrefixes: ["_"] })
    return fse.writeJSONSync(path, serialized)
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
  write, 
  createFolder,
  ensurePath, 
  exists,
  move,
  remove,
  makeBackup,
  restoreBackup,
};