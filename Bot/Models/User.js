module.exports = class User {
  create(discordUser) {
    this.id = discordUser.id;
    this.username = discordUser.username;
    this.avatar = User.makeDiscordAvatarUrl(discordUser);
    return this;
  }

  load(hash) {
    this.id = hash.id;
    this.username = hash.username;
    this.avatar = hash.avatar;
    return this;
  }

  ping() {
    return `<@!${this.id}>`
  }
  
  static makeDiscordAvatarUrl(discordUser) {
    const url = "https://cdn.discordapp.com/avatars/"
    return url + discordUser + "/" + discordUser.avatar + ".png";
  }
}