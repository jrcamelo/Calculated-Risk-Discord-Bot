const Discord = require('discord.js');
const BaseRollCommand = require("../roll_command")
const Roll = require("../../models/roll")

module.exports = class RollPresenter {
  constructor(roll, player, game) {
    this.roll = roll
    this.player = player
    this.game = game
  }

}
