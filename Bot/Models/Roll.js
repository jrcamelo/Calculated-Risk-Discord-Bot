
module.exports = class Roll {
  constructor(value, type, message) {
    this.value = value
    this.type = type
    this.message = message
    this.result = null // Calculate Roll
    this.time = Date.now()
  }  
}