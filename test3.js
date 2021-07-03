
require('reflect-metadata');
const fse = require("fs-extra")
const ct = require('class-transformer');
const deserializeHash = require('./Bot2/utils/deserialize_hash');


class Player {
  constructor(id, username, avatar, name, alive, left, rolled) {
    let discordUser = null
    let factionName = null
    this.id = discordUser ? discordUser.id : id;
    this.username = discordUser ? discordUser.username : username;
    this.avatar = discordUser ? null : avatar;
    this.name = factionName || name || "";
    this.alive = alive != null ? alive : true;
    this.left = left != null ? left : false;
    this.rolled = rolled != null ? rolled : false;  }

  roll() {
    console.log("I attack with my sword")
  }
}

const usersJson = fse.readFileSync("./test4.json")
let users = ct.deserialize(Player, usersJson)

console.log(users)
users[0].roll()
//console.log(JSON.parse(usersJson))

// users = {
//  "123": new Player(null, null, "123", "megu", "meguminpic", "megu!", true, false, true),
//  "abc": new Player(null, null, "abc", "not megu", "not meguminpic", "not megu!", false, false, false),
// }

fse.writeFileSync("test5.json", ct.serialize(users, { excludePrefixes: ["_"]}))

fse.writeFileSync("test6.json", ct.serialize(users[0], { excludePrefixes: ["_"]}))