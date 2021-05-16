const fs = require('fs');

function getSubFolders(path) {
  return fs.readdirSync(path).filter(function(subFolder) {
    return fs.statSync(`${path}/${subFolder}`).isDirectory()
  })
}

function getJsInFolder(path, folder) {
  return fs.readdirSync(`${path}/${folder}`).filter(function(file) {
    return file.endsWith('.js')
  })
}

function requireCommands() {
  let files = []
  for (const folder of getSubFolders("./commands/")) {
    for (const file of getJsInFolder("./commands/", folder))
      files.push(require(`../commands/${folder}/${file}`))
  }
  return files
}

module.exports = {
  getSubFolders,
  getJsInFolder,
  requireCommands,
}