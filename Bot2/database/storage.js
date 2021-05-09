const fse = require("fs-extra")

function read(path) {
  if (!exists) return null
  return fse.readJSONSync(path)
}

function write(path, content) {
  return fse.writeJSONSync(path, content)
}

function createFolder(path) {
  return fse.mkdirSync(path)
}

function ensurePath(path) {
  return fse.mkdirsSync(path)
}

function exists(path) {
  return fse.pathExistsSync(path)
}

function move(path, newPath) {
  return fse.moveSync(path, newPath)
}

function remove(path) {
  return fse.removeSync(path)
}

module.exports = { 
  read, 
  write, 
  createFolder,
  ensurePath, 
  exists,
  move,
  remove
};