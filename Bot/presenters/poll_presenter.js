const Discord = require('discord.js');
const { makePing } = require('../utils/discord')

module.exports = class PlayerPresenter {
  constructor(game) {
    this.game = game;
    this.turn = game._turn;
  }

  setTurn(index) {
    if (index == this.turn.number) return this.turn
    this.turn = this.game.getTurn(index);
    return this.turn;
  }

  makeEmbed(index) {
    if (this.setTurn(index) == null) return "ERROR: Turn not found."
    const embed = new Discord.MessageEmbed()
      .setTitle(`${this.turn.poll || `Turn ${index}`}`)
      .setFooter(`Turn ${index}/${this.game.turnNumber}`)
      .addFields(this.makeFields())
    return embed;
  }

  makeFields() {
    const aliveNotVoted = []
    const voteGroup = {}
    for (let player of this.turn.playerHashToList()) {
      const vote = this.turn.votes[player.id];
      if (!vote && player.alive) {
        aliveNotVoted.push(makePing(player));
        continue;
      } 
      if (!voteGroup[vote]) voteGroup[vote] = [makePing(player)];
      else voteGroup[vote].push(makePing(player));
    }

    const fields = []
    for (let vote in voteGroup) {
      const players = voteGroup[vote]
      const text = players.length > 1 
          ? `${players.length} votes: ${players.join(", ")}` 
          : `1 vote: ${players[0]}`;
      fields.push({
        name: `${vote}`,
        value: text,
      })
    }
    if (aliveNotVoted.length > 0) {
      fields.push({
        name: "No vote",
        value: aliveNotVoted.join(", "),
      })
    }
    if (fields.length == 0) {
      fields.push({
        name: "No players",
        value: ":(",
      })
    }
    return fields;
  }
}