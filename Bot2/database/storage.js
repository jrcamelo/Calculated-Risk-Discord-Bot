const fse = require("fs-extra")

function read(path) {
  if (!exists(path)) return null
  return fse.readJSONSync(path)
}

function write(path, content, classType) {
  try {
    makeBackup(path)
    return fse.writeJSONSync(path, content)
  } catch(e) {
    console.error("Error while writing file", e)
    restoreBackup(path)
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
  if (exists(path))
    return fse.copyFileSync(path, path + ".backup")
}

function restoreBackup(path) {
  if (exists(path + ".backup"))
    return fse.copyFileSync(path + ".backup", path)
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