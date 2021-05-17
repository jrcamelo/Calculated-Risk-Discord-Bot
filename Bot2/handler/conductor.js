const WaitQueue = require("wait-queue")
const Parser = require("./parser")

// Every message is sent to the message queue
// If the message is valid, it is sent to one of the channel queues
// Each channel queue iterates synchronously every message
module.exports = class Conductor {
  static channelQueues = {}
  static messageQueue = new WaitQueue()
  static isEnabled = true
  static isRunning = false

  static onNewMessage(message) {
    if (Conductor.isEnabled) {
      Conductor.messageQueue.push(message)
    }
  }

  static enable() {
    if (!this.isRunning) {
      setImmediate(this.readMessageQueue)
      this.isRunning = true
    }
  }

  static readMessageQueue() {
    Conductor.messageQueue.shift().then(async function(message) {
      if (Parser.isValid(message)) {
        const channel = message.channel.id
        Conductor.addToMessageQueue(channel, message)
      }
      setImmediate(Conductor.readMessageQueue);
    }).catch(function(e) {
      console.error("Error while reading message queue", e);
      setImmediate(Conductor.readMessageQueue);
    });
  }

  static addToMessageQueue(id, message) {
    if (!(id in this.channelQueues)) {
      this.channelQueues[id] = new WaitQueue()
      setImmediate(this.readChannelQueue, id);
    }
    this.channelQueues[id].push(message)
  }

  static async readChannelQueue(id) {
    Conductor.channelQueues[id].shift().then(async function(message) {
      await Conductor.handleMessage(message)
      setImmediate(Conductor.readChannelQueue, id);
    })
    .catch(function(e) {
      console.error("Error while reading channel queue: " + id, e);
      setImmediate(Conductor.readChannelQueue, id);
    });
  }

  static async handleMessage(message) {
    try {
      const command = new Parser(message).getCommand();
      if (command) {
        await command.tryExecute()
      }
    } catch(e) {
      console.error(`\n${message.content} caused an error at ${new Date()}`, e);
    }
  }

  static disable() {
    if (this.isRunning) {
      this.messageQueue.clear()
      clearImmediate(this.readMessageQueue)
      this.cleanChannelQueues()
      this.isRunning = false
    }
  }
  
  static cleanChannelQueues() {
    Object.keys(this.channelQueues).forEach(channel => {
      clearImmediate(this.readChannelQueue, channel)
      this.channelQueues[channel].clearListeners()
      delete this.channelQueues[channel]
    });
  }
}