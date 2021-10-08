const Parser = require("../handler/parser");
const Discord = require("discord.js");
const BotInfo = require("../utils/bot_info");

module.exports = class HelpPresenter {
  constructor() {
  }

  makeHelpEmbed() {
  }

  makeCommandEmbed(commandText) {
    const command = Parser.commands[commandText];
    if (!command) return null
    const field = this.makeCommandField(command);
    if (!field) return null;
    return this.makeBaseHelpEmbed()
      .addFields([field])
  }

  makeBaseHelpEmbed() {
    return new Discord.MessageEmbed()
      .setAuthor("Calculated Risk — Host Risk games on Discord", BotInfo.botAvatar)
      .setColor("#5865f2")
      .setFooter(`Made by Megu — ${BotInfo.botOwner}`, BotInfo.botOwnerAvatar)
  }

  makeBotHelpEmbed() {
    let description = "This bot is focused on image board **Risk** games. "
    description += "\nIts goals are to help Game Masters keep track of everything and "
    description += "give players versatile Roll features, while keeping the status of the game within hand's reach."

    description += "\n\n**GAME MASTERS**"
    description += "\nGames are hosted in channels, only one per channel, "
    description += "with the user who started it being the Game Master and getting both the powers and responsibilities that come with the role. "
    description += "\nFor more info on how to host games, check out the `r.HelpMaster` (r.hm) command. "

    description += "\n\n**PLAYERS**"
    description += "\nPlayers have a way simpler role, where they can join ongoing games, claim a Faction, ally or betray others, "
    description += "and roll to conquer the world, universe or whatever is at stake, or simply meet their demise. "
    description += "\nFor more info on how to play, check out the `r.HelpPlayer (r.hp)` and `r.HelpLevel (r.hl)` commands. "

    description += "\n\nThere are a lot of other commands that help you keep track of what's happening and has happened in the game, "
    description += "as well as some Admin related features to customize the bot, so please check out `r.HelpUtil` (r.hu) for more info. "

    description += "\n\nKeeping this bot up and running is only possible [thanks to the awesome supporters.](https://www.patreon.com/jrlol3)"

    return this.makeBaseHelpEmbed()
      .setThumbnail("https://i.imgur.com/pIr8hmb.jpg")
      .setDescription(description)
  }

  makeMasterHelpEmbed() {
    let description = "\n\nMasters start the game in a channel, wait for players to join or just add them, change the turns and mups when players have rolled, "
    description += "manage their life and death, and when there is finally peace, finish the game, where it will be saved for eternity."
    
    description += "\n\nBeing a Master is a selfless job, where the fun comes from seeing the friendships broken along the way."
    
    description += "\n-"

    return this.makeBaseHelpEmbed()
      .setTitle("The Master is whom the players must praise as their God.")
      .setDescription(description)
      .addFields(this.makeCommandFields(this.getMasterCommands()))
  }

  makePlayerHelpEmbed() {
    let description = "\n\nPlayers claim a Faction in a game, then roll to kill each other, as the Master commands."
    description += "\nIt is a social strategy game, where you can make allies, betray them, apply big brain tactics and roll high to decimate your enemies."
    
    description += "\n\nCheck `HelpLevel` for leaderboard and meta related commands."

    description += "\n-"

    return this.makeBaseHelpEmbed()
      .setTitle("The Player's life lays on the hands of RNG and the Master.")
      .setDescription(description)
      .addFields(this.makeCommandFields(this.getPlayerCommands()))
  }

  makeUtilHelpEmbed() {
    let description = "Risk is a simple game, but thanks to its social nature, it can get a little confusing. "
    description += "\nThere are some commands, usable by Players, Masters and onlookers, that help understand what's happening "
    description += "and check what happened over the course of those 800 messages you didn't read. "

    // description += "\n\nYou can also somewhat customize the bot by using some Admin commands so it fits your server needs."

    description += "\n-"

    return this.makeBaseHelpEmbed()
      .setTitle("Utilities and Admin commands")
      .setDescription(description)
      .addFields(this.makeCommandFields(this.getUtilCommands()))
  }

  makeLevelHelpEmbed() {
    let description = "By playing Risk, you can level up and set records. "
    description += "\nThere's a Leaderboard of best players, a Hall of Rolls for the highest scored rolls in history, "
    description += "and a neat Profile Card with some handy stats. "

    description += "\n\nYou earn XP by rolling and winning games, or by being a Master."

    description += "\n\nAh, and don't forget your mistakes are recorded forever, as every game is stored for eternity and can be checked at will. "

    description += "\n-"

    return this.makeBaseHelpEmbed()
      .setTitle("Meta related commands")
      .setDescription(description)
      .addFields(this.makeCommandFields(this.getLevelCommands()))
  }

  getMasterCommands() {
    return [
      Parser.commands["startgame"],
      Parser.commands["endgame"],
      Parser.commands["add"],
      Parser.commands["kill"],
      Parser.commands["turn"],
      Parser.commands["turnedit"],
      Parser.commands["faction"],
      Parser.commands["setbonus"],
      Parser.commands["setnote"],
      Parser.commands["ping"],
      Parser.commands["kick"],
      Parser.commands["purge"],
      Parser.commands["renamegame"],
    ]
  }

  getPlayerCommands() {
    return [
      Parser.commands["claim"],
      Parser.commands["roll"],
      Parser.commands["rollid"],
      Parser.commands["rollx"],
      Parser.commands["rolld"],
      Parser.commands["rollxd"],
      Parser.commands["testroll"],
      Parser.commands["ragequit"],
      Parser.commands["status"],
      Parser.commands["ally"],
    ]
  }

  getUtilCommands() {
    return [
      Parser.commands["who"],
      Parser.commands["alliances"],
      Parser.commands["notes"],
      Parser.commands["history"],
      Parser.commands["links"],
      Parser.commands["allmups"],
    ]
  }

  getLevelCommands() {
    return [
      Parser.commands["profile"],
      Parser.commands["top"],
      Parser.commands["hall"],
      Parser.commands["past"],
    ]
  }

  makeCommandFields(commands) {
    return commands.map(command => this.makeCommandField(command))
  }

  makeCommandField(command) {
    if (command == null) return console.log("NULL COMMAND ON HELP")
    return {
      name: this.makeCommandNameAndUsage(command),
      value: this.makeCommandDescriptionAndAliases(command),
    }
  }

  makeCommandNameAndUsage(command) {
    return `${command.aliases[0]}`;
  }

  makeCommandDescriptionAndAliases(command) {
    const args = `${command.argsDescription ? `\nArgs: **${"`" + command.argsDescription + "`"}**`: ""}`
    const aliases = `${command.aliases.length > 1 ? `Aliases: ${"`" + command.aliases.slice(1).join(", ") + "`"}` : ""}`
    return `${command.description}${args}${args && aliases ? " — " : "\n" }${aliases}`
  }

  getPatreonList() {
    // TODO
    return "- Myself :)"
  }
}