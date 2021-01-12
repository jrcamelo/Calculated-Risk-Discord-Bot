const Discord = require('discord.js');
const User = require("./User");
const Turn = require("./Turn");
const Player = require("./Player");
const Mup = require("./Mup");
const Utils = require("../Utils");

module.exports = class Game {
  create(user, name) {    
    this.name = name;
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
    this.name = hash.name;
    this.master = new User().load(hash.master);
    this.turns = this.loadTurns(hash.turns);
    this.currentTurn = hash.currentTurn;
    this.startedAt = hash.startedAt;
    this.endedAt = hash.endedAt;
    return this;
  }

  loadTurns(hash) {
    let turns = [];
    for (turn of hash) {
      turns.push(new Turn().load(turn));
    }
    return turn;
  }

  // Event

  finish() {
    this.endedAt = Date.now();
  }

  nextTurn(mup, description) {
    oldTurn = this.getTurn();
    this.currentTurn += 1;
    this.turns.push(new Turn().create(mup, description, oldTurn.players));
    return this.getTurn();
  }

  // Descriptions

  makeCurrentGameEmbed(index, showMupDescription=false) {
    if (index == null) {
      index = this.turn;
    }
    let embed = new Discord.MessageEmbed()
      .setColor('#c90040')
      .setTitle(this.name)
      .setAuthor(`Game Master: ${this.master.username}`, this.master.avatar)
      .setDescription(this.makeDescription(index, showMupDescription))
      .setThumbnail(this.getMupImage(index))
      .setFooter(`Turn ${index} of ${this.turns.length - 1} `)
    return embed;
  }

  makeDescription(index, showMupDescription) {
    const turn = this.getTurn(index);
    let text = "";
    if (showMupDescription) {
      text += `${turn.description}\n\n`;
    }

    const turnPlayers = turn.playerHashToList();
    if (!turnPlayers.length) {
      return "No players."
    }
    for (let player of turnPlayers) {
      text += `\n${player.describePlayerCompact()}`
    }
    return text;
  }

  // makeDescriptionOfPlayers(index) {
  //   const turn = this.getTurn();
  //   if (!Object.keys(this.players).length) {
  //     return "No players."
  //   }
  //   let text = ""
  //   for (let player of this.playerHashToList()) {
  //     text += `\n${player.describePlayerCompact(turn)}`
  //   }
  //   return text;
  // }

  // Utils

  getTurn(turn=null) {
    if (turn == null) {
      turn = this.currentTurn;
    }
    return this.turns[turn];
  }
}