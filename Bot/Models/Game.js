const Discord = require('discord.js');
const User = require("./User");
const Turn = require("./Turn");
const Player = require("./Player");
const Utils = require("../Utils");

module.exports = class Game {
  create(user, name) {    
    this.name = Utils.sanitize(name);
    this.master = new User().create(user);
    this.currentTurn = 0;
    this.turns = [new Turn().create()];
    this.startedAt = Date.now();
    this.endedAt = null;
    return this;
  }
  
  load(hash) {
    if (hash == null) {
      return null;
    }
    this.name = Utils.decode(hash.name);
    this.master = new User().load(hash.master);
    this.turns = this.loadTurns(hash.turns);
    this.currentTurn = hash.currentTurn;
    this.startedAt = hash.startedAt;
    this.endedAt = hash.endedAt;
    return this;
  }

  encode() {
    this.name = Utils.encode(this.name);
    this.master.encode();
    for (let i in this.turns) {
      this.turns[i].encode();
    }
  }

  loadTurns(hash) {
    let turns = [];
    for (let turn of hash) {
      turns.push(new Turn().load(turn));
    }
    return turns;
  }

  // Event

  finish() {
    this.endedAt = Date.now();
  }

  nextTurn(mup, description) {
    let oldTurn = this.getTurn();
    this.currentTurn += 1;
    this.turns.push(new Turn().create(mup, description, oldTurn.players));
    return this.getTurn();
  }

  // Descriptions

  makeCurrentGameEmbed(index, showMore=false) {
    if (index == null || index < 0 || index > this.currentTurn) {
      index = this.currentTurn;
    }
    let embed = new Discord.MessageEmbed()
      .setTitle(this.name)
      .setAuthor(`Game Master: ${this.master.username}`, this.master.avatar)
      .setDescription(this.makeEmbedDescription(index, showMore))
      .setFooter(`Turn ${index} of ${this.turns.length - 1} `)
    let mup = this.getMupImage(index);
    if (showMore && mup) {
      embed.setImage(mup)
    } else {
      embed.setThumbnail(mup)
    }
    return embed;
  }

    makeCurrentGameEmbedCompact(index, showMore=false) {
    if (index == null || index < 0 || index > this.currentTurn) {
      index = this.currentTurn;
    }
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Game Master: ${this.master.username}`, this.master.avatar)
      .setDescription(this.makeEmbedDescriptionCompact(index, showMore))
      .setFooter(`${index}/${this.turns.length - 1} `)
    let mup = this.getMupImage(index);
    if (showMore && mup) {
      embed.setImage(mup)
    } else {
      embed.setThumbnail(mup)
    }
    return embed;
  }

  getMupImage(index) {
    const turn = this.getTurn(index);
    return turn.mup;
  }

  makeEmbedDescription(index, showMore) {
    const turn = this.getTurn(index);
    let text = "";
    if (showMore) {
      text += `${turn.description}\n`;
    }

    const turnPlayers = turn.playerHashToSortedList();
    if (!turnPlayers.length) {
      return "No players."
    }
    for (let player of turnPlayers) {
      text += `\n${player.describePlayerCompact()}`
    }
    return text;
  }

  makeEmbedDescriptionCompact(index, showMore) {
    const turn = this.getTurn(index);
    let text = "";
    const turnPlayers = turn.playerHashToSortedList();
    if (!turnPlayers.length) {
      return "Nothing."
    }
    for (let player of turnPlayers) {
      text += `\n${player.describePlayerMinimum()}`
    }
    return text;
  }

  makeListOfMups(index=0) {
    let text = `Mup images for turns ${index} - ${index+10}:\n`;
    for (let i = index; i < index + 10; i++) {
      let turn = this.getTurn(i);
      if (turn && turn.mup) {
        text += `<${turn.mup}>\n`
      }
    }
    return text;
  }

  // Utils

  getTurn(turn=null) {
    if (turn == null) {
      turn = this.currentTurn;
    }
    if (turn > this.currentTurn) {
      return null;
    }
    return this.turns[turn];
  }
}