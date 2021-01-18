class Parser {
  static defaultPrefix = "r."

  Base = require("./Commands/Base")
  Help = require("./Commands/Help")
  GameStart = require("./Commands/GameStart")
  GameEnd = require("./Commands/GameEnd")
  GameWhat = require("./Commands/GameWhat")
  Claim = require("./Commands/Claim")
  Add = require("./Commands/PlayerAdd")
  Kill = require("./Commands/PlayerKill")
  Revive = require("./Commands/PlayerRevive")
  Kick = require("./Commands/PlayerKick")
  History = require("./Commands/History")
  Unroll = require("./Commands/PlayerUnroll")
  Mup = require("./Commands/Mup")
  MupChange = require("./Commands/MupChange")
  Mups = require("./Commands/GameMups");
  Ping = require("./Commands/PlayerPing")
  NotRolled = require("./Commands/PlayerNotRolled")
  Roll = require("./Commands/Roll")
  RollId = require("./Commands/RollId")
  RollUntracked = require("./Commands/RollUntracked")
  RollUntrackedId = require("./Commands/RollUntrackedId")
  ChangePrefix = require("./Commands/ChangePrefix")
  constructor(message, db) {
    this.message = message;
    this.db = db;

  }

  static async isValidMessage(message) {
    if (!message || !message.channel || !message.channel.guild) return false;
    if (message.author.bot) return false;
    return true;
  }

  static async updateSavedPrefix(server) {
    const Bot = require("./Bot");
    Parser.savedPrefixes[server] = await Bot.db.getPrefix(server) || Parser.defaultPrefix;
  }
  
  static savedPrefixes = {};
  
  async startsWithPrefix() {
    const server = this.message.channel.guild.id;
    this.prefix = Parser.savedPrefixes[server] || await this.db.getPrefix(server) || Parser.defaultPrefix;
    Parser.savedPrefixes[server] = this.prefix;
    if (!this.message.content.toLowerCase().startsWith(this.prefix) && !this.message.content.startsWith(Parser.defaultPrefix)) {
      return false;
    } else {
      return true;
    }
  }

  parse() {
    const commands = [
      this.GameStart, 
      this.GameEnd, 
      this.GameWhat,
      this.History,
      this.Claim, 
      this.Add,
      this.Kill, 
      this.Revive, 
      this.Kick, 
      this.Unroll,
      this.Mup, 
      this.MupChange,
      this.Mups,
      this.Ping, 
      this.NotRolled,
      this.Roll, 
      this.RollId, 
      this.RollUntracked, 
      this.RollUntrackedId,
      this.ChangePrefix,
    ];

    this.separateCommandAndArgs();

    if (this.Help.isRequestedCommand(this.command)) {
      const helpCommands = {
        player: [
          this.GameWhat, 
          this.Claim,
          this.History,
          this.NotRolled,
          this.Mups,
          this.Roll, 
          this.RollId,
          this.RollUntracked,
          this.RollUntrackedId,
        ],
        master: [          
          this.GameStart, 
          this.GameEnd, 
          this.Mup, 
          this.MupChange,
          this.Add,
          this.Unroll,
          this.Kill, 
          this.Revive, 
          this.Kick, 
          this.Ping,
          this.ChangePrefix,
        ]
      };

      this.Base.prefix = this.prefix;
      return new this.Help(this.message, helpCommands);
    }

    for (let botCommand of commands) {
      if (botCommand.isRequestedCommand(this.command)) {
        return new botCommand(this.message, this.args, this.command)
      }
    }
  }
  
  async isUserMod() {
    const member = await this.message.guild.member(this.message.author);
    if (member) return await member.hasPermission("MANAGE_MESSAGES");
  }

  separateCommandAndArgs() {
    const commandBody = this.removePrefix();
    this.args = commandBody.split(' ');
    if (this.args.length > 1) {
      this.command = this.args.shift().toLowerCase();
    }
    else {
      this.command = this.args[0]
      this.args = [];
    }
  }

  removePrefix() {
    return this.message.content.slice(this.prefix.length);
  }
}
module.exports = Parser