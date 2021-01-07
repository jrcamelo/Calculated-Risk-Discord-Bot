require('dotenv').config()
const Discord = require("discord.js");
const Parser = require("./Parser.js");
const Database = require("./Database");

class Bot {
  static db;
  static client;
  static timer;
  static messageQueue;

  static async initialize() {
    console.log("Initializing bot...");
    Bot.db = new Database();
    Bot.client = new Discord.Client();
    Bot.messageQueue = [];
    Bot.client.on("message", async function(message) {
      Bot.messageQueue.push(message);
    });
    await Bot.client.login(process.env.BOT_TOKEN);
    await Bot.setStatus();

    console.log("Bot is now calculating.");
    // Testing
    console.log(await Bot.db.getAll())
    Bot.startMessageQueueReader();
  }

  static async startMessageQueueReader() {
    while (true) {
      const message = Bot.messageQueue.shift();
      if (message) {
        await Bot.readMessage(message);
      } else {
        await Bot.sleep(100);
      }
    }
  }

  static sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
  } 

  static async setStatus() {
    await Bot.client.user.setPresence({
        status: "online",
        activity: {
            name: "r.help",
            type: "PLAYING",
        }
    });
  }

  static async readMessage(message) {
    try {
      if (Parser.isValidMessage(message)) {
        const command = new Parser(message).parse();
        if (command) {
          return await command.tryExecute();
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  static getProfilePicture() {
    const url = "https://cdn.discordapp.com/avatars/"
    return url + Bot.client.user + "/" + Bot.client.user.avatar + ".png";
  }

  static getOwnerPicture() {
    return "https://cdn.discordapp.com/avatars/464911746088304650/b4cf2c3e345edcfe9b329611ccce509b.png"
  }

}
module.exports = Bot;