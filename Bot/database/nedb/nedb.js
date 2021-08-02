const nedb = require("nedb-promises")
const path = require("path")

module.exports = class NeDB {
  static BASE_PATH = path.join(process.cwd(), process.env.DATABASE_PATH)

  static pathToServer(serverId) {
    return path.join(NeDB.BASE_PATH, `/servers/${serverId}/`)
  }

  static pathToServerWithFile(serverId, file) {
    return path.join(NeDB.pathToServer(serverId), file)
  }

  constructor(filepath, onload) {
    this.filepath = filepath
    this.db = new nedb({
      filename: filepath,
      autoload: true,
      onload: onload
    })
  }

  async find(query) {
    try { return this.db.find(query).limit(limit).skip(skip) } catch(e) { return console.log(e) }
  }

  async findId(id) {
    try { return this.db.find({ id }) } catch(e) { return console.log(e) }
  }

  async findOne(query) {
    try { return this.db.findOne(query) } catch(e) { return console.log(e) }
  }

  async findSorted(query, sort, skip=0, limit=0) {
    try { return this.db.find(query).sort(sort).limit(limit).skip(skip) } catch(e) { return console.log(e) }
  }

  async count(query) {
    try { return this.db.count(query) } catch(e) { return console.log(e) }
  }
  
  async insert(data) {
    try { return this.db.insert(data) } catch(e) { return console.log(e) }
  }

  async upsert(data, query) {
    try { return this.db.update(query, data, { upsert: true }) } catch(e) { return console.log(e) }
  }

  async upsertId(data) {
    try { return this.db.update({ id: data.id }, data, { upsert: true }) } catch(e) { return console.log(e) }
  }

  async upsertField(data, field) {
    try {
      return this.db.update(
        { [field]: data[field] }, 
        data, 
        { upsert: true }
      ) 
    } catch(e) { return console.log(e) }
  }

  async update(query, data) {
    try { return this.db.update(query, data) } catch(e) { return console.log(e) }
  }

  async updateId(data) {
    try { return this.db.update({ id: data.id }, data) } catch(e) { return console.log(e) }
  }

  async updateWithQuery(findQuery, updateQuery) {
    try { return this.db.update(findQuery, updateQuery) } catch(e) { return console.log(e) }
  }


}