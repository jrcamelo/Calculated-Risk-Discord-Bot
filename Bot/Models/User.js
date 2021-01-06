module.exports = class User {
  create(discordUser) {
    this.id = discordUser.id;
    this.username = discordUser.username;
    return this;
  }

  load(hash) {
    this.id = hash.id;
    this.username = hash.username;
    return this;
  }

  ping() {
    return `<@!${this.id}>`
  }
}