const Discord = require('discord.js');
const User = require("./User");
const Player = require("./Player");
const Utils = require("../Utils");
const Roll = require("./Roll")

module.exports = class Turn {
  
  // Constructors

  create(mup="", description="", players=null) {
    this.mup = mup;
    this.description = Utils.sanitize(description);
    this.history = [];
    if (players != null) {
      this.players = this.playersFromPreviousTurn(players)
    } else {
      this.players = {};
    }
    return this;
  }

  playersFromPreviousTurn(oldPlayers) {
    let newPlayers = {};
    for (let player of Object.values(oldPlayers)) {
      if (player.left != true) {
        let newPlayer = new Player().newTurn(player);
        newPlayers[newPlayer.user.id] = newPlayer;
      }
    }
    return newPlayers;
  }
  
  load(hash) {
    if (hash == null) {
      return null;
    }
    this.mup = Utils.decode(hash.mup);
    this.description = Utils.decode(hash.description);
    this.players = this.loadPlayerHash(hash.players);
    this.history = this.loadHistory(hash.history);
    return this;
  }

  loadPlayerHash(players) {
    const result = {};
    for (const [key, value] of Object.entries(players)) {
      const player = new Player().load(value)
      result[key] = player;
    }
    return result;
  }

  loadHistory(hash) {
    const result = [];
    for (let hist of hash) {
      result.push(Utils.decode(hist));
    }
    return result;
  }

  encode() {
    this.mup = Utils.encode(this.mup);
    this.description = Utils.encode(this.description);
    for (const [key, value] of Object.entries(this.players)) {
      this.players[key].encode();
    }
    for (let i in this.history) {
      this.history[i] = Utils.encode(this.history[i]);
    }
  }

  update(mup, description) {
    this.mup = mup || this.mup;
    this.description = description || this.description;
  }

  // Player Management
  
  addPlayer(discordUser, factionName) {
    const oldPlayer = this.getPlayer(discordUser);
    if (oldPlayer != null) {
      oldPlayer.name = Utils.sanitize(factionName);
      oldPlayer.left = false;
      return oldPlayer;
    }
    const player = new Player().create(discordUser, factionName);
    this.players[player.user.id] = player;
    return player;
  }

  getPlayer(discordUser) {
    return this.players[discordUser.id];
  }

  deletePlayer(player) {
    player.alive = false;
    player.left = true;
  }

  deletePlayerInstantly(player) {
    delete this.players[player.user.id]
  }

  doPlayerRoll(message, type, arg, limit) {
    let player = this.getPlayer(message.author);
    let roll = player.roll(message, type, arg, limit)
    if (roll.shouldSave) {
      this.history.push(roll.describeHistoryForText(player));
      if (this.isAllPlayersRolled()) {
        roll.wasLastRoll = true;
      }
    }
    return roll;
  }

  killPlayer(player) {
    player.alive = false;
    this.history.push(player.describeDeath());
  }

  revivePlayer(player) {
    player.alive = true;
    player.left = false;
    this.history.push(player.describeRevival());
    return true;
  }

  unrollPlayer(player) {
    player.unroll();
  }

  // Mup Management
  
  updateMup(link, description) {
    if (!link || !Utils.isImage(link)) {
      link = this.mup;
    }
    this.mup = link;
    this.description = description || this.description;
  }

  // Descriptions

  makeEntireHistoryText(short=false) {
    if (this.history.length == 0) {
      return "Peace. For now."
    }
    let text = "";
    for (let event of this.history) {
      if (short && event.length > 80) {
        text += event.slice(0, 80) + "\n";
      } else {
        text += event + "\n";
      }
    }
    return text;
  }

  pingNotPlayed() {
    if (!Object.keys(this.players).length) {
      return "Nobody is playing yet."
    }
    let text = ""
    for (let player of this.playerHashToList()) {
      if (player.alive && !player.rolled) {
        text += `${player.user.ping()} `
      }
    }
    return text || "No players need to roll.";
  }

  pingAlive() {
    if (!Object.keys(this.players).length) {
      return "Nobody is playing yet."
    }
    let text = ""
    for (let player of this.playerHashToList()) {
      if (player.alive) {
        text += `${player.user.ping()} `
      }
    }
    return text || "This is a cemetery.";
  }

  pingAll() {
    if (!Object.keys(this.players).length) {
      return "Nobody is playing yet."
    }
    let text = ""
    for (let player of this.playerHashToList()) {
      text += `${player.user.ping()} `
    }
    return text || "No players need to roll.";
  }

  listNotPlayed() {
    if (!Object.keys(this.players).length) {
      return "Nobody is playing yet."
    }
    let players = ""
    for (let player of this.playerHashToList()) {
      if (player.alive && !player.rolled) {
        players += `${player.user.username}\n`
      }
    }
    if (players) {
      return `Players who have not rolled yet:\n${players}`
    } else {
      return "No players need to roll.";
    }
  }

  getAllRollLinksEmbed(index) {
    const rolls = this.getAllRollsWithPlayer();
    index = index % (Math.ceil(rolls.length / 10) * 10)

    let description = "";
    for (let i = index; i < index + 10; i++) {
      if (i < rolls.length) {
        description += rolls[i].describeHistoryForEmbedCompact(rolls[i].player) + "\n";
      }
    }
    let embed = new Discord.MessageEmbed()
      .setDescription(description || "No rolls")
      .setFooter(`${index+1} - ${index+10}/${rolls.length}`)
    return embed;
  }

  // Utils
  
  playerHashToList() {
    return Object.values(this.players);
  }

  playerHashToSortedList() {
    let players = this.playerHashToList();
    players.sort((a,b) => (a.compareFirstRolls(b)));
    return players;
  }

  isAllPlayersRolled() {
    for (let player of this.playerHashToList()) {
      if (player.alive && !player.rolled) {
        return false;
      }
    }
    return true;
  }

  getAllRollsWithPlayer() {
    let rolls = [];
    for (let player of this.playerHashToSortedList()) {
      if (player.rolled) {
        for (let roll of player.rolls) {
          let newRoll = new Roll().load(roll);
          newRoll.player = player;
          rolls.push(newRoll);
        }
      }
    }
    return rolls;
  }
}