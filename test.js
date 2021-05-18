require('reflect-metadata');
const fse = require("fs-extra")
const ct = require('class-transformer');
const Base32 = require("base32")

class Player {
  constructor(name, rolls) {
    this.name = name
    this._aaa = "AAAA"
  }

  prepare() {
    this.rolls = this.rolls.map(roll => ct.plainToClass(Roll, roll))
    return this
  }

  roll() {
    let roll = Math.random() * 1000
    console.log(roll)
    this.rolls.push(new Roll(roll, Date.now))
  }
}

class Roll {
  constructor(value, time) {
    this.value = value
    this.time = time
  }

  what() {
    console.log("IT WAS " + this.value)
  }
}


const usersJson = fse.readFileSync("./test.json")
const users = ct.deserialize(Player, usersJson).map(p => p.prepare())
users[0].rolls[0].what()

fse.writeFileSync("test2.json", ct.serialize(users, { excludePrefixes: ["_"]}))
