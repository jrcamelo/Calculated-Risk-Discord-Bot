const WaitQueue = require("wait-queue")

// Tasks can add themselves to a server task queue or a global task queue.
// The server task queue is used to coordinate between tasks on the same server.
// The global task queue is used to coordinate between servers.
module.exports = class TaskConductor {
  static serverTaskQueues = {}
  static globalTaskQueue = new WaitQueue()
  static globalTaskQueueRunning = false

  static addServerTask(task) {
    if (!task) return console.log("Server Task was null?")
    if (!task.serverId) return console.log("Task's Server ID was null on " + task.name)
    if (!TaskConductor.serverTaskQueues[task.serverId]) {
      TaskConductor.serverTaskQueues[task.serverId] = new WaitQueue()
      setImmediate(TaskConductor.readServerTaskQueue, task.serverId);
    }
    TaskConductor.serverTaskQueues[task.serverId].push(task)
  }

  static async readServerTaskQueue(serverId) {
    TaskConductor.serverTaskQueues[serverId].shift().then(async function(task) {
      await TaskConductor.handleTask(task)
      setImmediate(TaskConductor.readServerTaskQueue, serverId);
    })
    .catch(function(e) {
      console.error("Error while reading server task queue: " + serverId, e);
      setImmediate(TaskConductor.readServerTaskQueue, serverId);
    });
  }

  static addGlobalTask(task) {
    if (!task) return console.log("Global Task was null?")
    TaskConductor.globalTaskQueue.push(task)
    if (!TaskConductor.globalTaskQueueRunning) {
      TaskConductor.globalTaskQueueRunning = true
      setImmediate(TaskConductor.readGlobalTaskQueue)
    }
  }

  static async readGlobalTaskQueue() {
    TaskConductor.globalTaskQueue.shift().then(async function(task) {
      await TaskConductor.handleTask(task)
      setImmediate(TaskConductor.readGlobalTaskQueue);
    })
    .catch(function(e) {
      console.error("Error while reading global task queue", e);
      setImmediate(TaskConductor.readGlobalTaskQueue);
    });
  }

  static async handleTask(task) {
    try {
      await task.tryExecute()
    } catch (e) {
      console.error("Error while running task: " + task.name, e);
    }
  }
  

}