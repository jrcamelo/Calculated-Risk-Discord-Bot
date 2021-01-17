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
      const response = await Bot.readMessage(message)
      if (!response) {
        await Bot.sleep(50);
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
      if (await Parser.isValidMessage(message)) {
        const parser = new Parser(message, this.db);
        if (await parser.startsWithPrefix(message)) {
          const command = parser.parse();
          if (command) {
            return await command.tryExecute() || true;
          }
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  static updateSavedPrefix(server) {
    Parser.updateSavedPrefix(server);
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