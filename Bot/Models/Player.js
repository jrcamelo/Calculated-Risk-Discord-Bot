

module.exports = class Player {
  constructor(discordUser, factionName) {
    this.__discordUser = discordUser
    this.id = discordUser.id
    this.username = discordUser.username
    this.avatar = discordUser.avatar
    this.name = factionName
    this.alive = true
    this.allies = []
    this.rolled = false
    this.rolls = []
  }
  
}