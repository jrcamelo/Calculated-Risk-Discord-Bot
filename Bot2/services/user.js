const TextUtils = require("../utils/text");

module.exports = class User {
  create(discordUser) {
    this.id = discordUser.id;
    this.username = TextUtils.sanitize(discordUser.username);
    this.avatar = User.makeDiscordAvatarUrl(discordUser);
    return this;
  }

  load(hash) {
    this.id = hash.id;
    this.username = Utils.decode(hash.username);
    this.avatar = hash.avatar;
    return this;
  }

  loadClean(hash) {
    this.id = hash.id;
    this.username = hash.username;
    this.avatar = hash.avatar;
    return this;
  }

  encode() {
    this.username = Utils.encode(this.username);
  }

  ping() {
    return `<@!${this.id}>`
  }
  
  static makeDiscordAvatarUrl(discordUser) {
    const url = "https://cdn.discordapp.com/avatars/"
    return url + discordUser + "/" + discordUser.avatar + ".png";
  }
}