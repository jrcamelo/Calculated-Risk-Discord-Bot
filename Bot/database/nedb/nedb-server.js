const NeDB = require("./nedb");

module.exports = class ServerDatabase {
  constructor(serverId, file, onload) {
    this.serverId = serverId;
    this.filename = NeDB.pathToServerWithFile(serverId, file)
    this.db = new NeDB(this.filename, onload)
  }
}

