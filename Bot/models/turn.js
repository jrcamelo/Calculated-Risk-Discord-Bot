const Player = require("./player");
const bronKerbosch = require("../utils/bronkerbosch")

module.exports = class Turn {
  constructor(_database, mup = "", description = "", number = 0, players = null, factionSlots = null, diplomacy=null, rolls = null, poll = "", votes = null) {
    this._database = _database
    this.description = description
    this.mup = mup
    this.number = number
    this.poll = poll
    this.votes = votes || {}
    this.factionSlots = factionSlots || []
    this.diplomacy = diplomacy
    this._players = players || {}
    this._rolls = rolls || []
  }

  static fromPreviousTurn(_database, previous, mup, description, factionSlots, diplomacy) {
    return new Turn(
      _database,
      mup,
      description,
      (previous.number || 0) + 1,
      this.playersToNewTurn(previous._players),
      factionSlots,
      diplomacy,
    )
  }
  
  static playersToNewTurn(oldPlayers) {
    const newPlayers = {};
    for (let player of Object.values(oldPlayers)) {
      if (player.removed != true) {
        const newPlayer = Player.newTurn(player);
        newPlayers[newPlayer.id] = newPlayer;
      }
    }
    return newPlayers;
  }

  save() {
    return this._database.saveTurn(this, this.number)
  }

  saveOld() {
    return this._database.saveTurn(this, this.number)
  }

  getPlayer(discordUser) {
    if (!discordUser) return null
    return this._players[discordUser.id];
  }

  getPlayerFromId(id) {
    return this._players[id];
  }

  addPlayer(discordUser, factionName) {
    const faction = factionName ? this.getAndRemoveFactionIfExists(factionName) : ""
    this._players[discordUser.id] = new Player(discordUser, faction)
    return this._players[discordUser.id]
  }

  renamePlayer(player, factionName) {
    player.name = this.getAndRemoveFactionIfExists(factionName)
    return player
  }

  getAndRemoveFactionIfExists(faction) {
    const existingFaction = this.getFaction(faction)
    if (existingFaction) {
      this.removeFaction(existingFaction)
      return existingFaction
    } else {
      return faction
    }
  }

  kickPlayer(player) {
    player.alive = false;
    player.removed = true;
  }
  banPlayer(player) {
    delete this._players[player.id]
  }

  killPlayer(player) {
    player.alive = false
  }
  revivePlayer(player) {
    player.alive = true
  }

  addRoll(roll) {
    this._rolls.push(roll)
    this._players[roll.playerId].rolled = true
    this._players[roll.playerId].rollTime = roll.time;
  }
  
  playerHashToList() {
    const list = Object.values(this._players)
    list.sort((a, b) => a.compareToOtherPlayer(b))
    return list;
  }

  rollListToPlayerHash() {
    const groupedByPlayer = {}
    for (let roll of this._rolls) {
      if (!groupedByPlayer[roll.playerId]) {
        groupedByPlayer[roll.playerId] = []
      }
      groupedByPlayer[roll.playerId].push(roll)
    }
    return groupedByPlayer
  }

  everyoneHasRolled() {
    return this.playerHashToList().every(player => player.rolled)
  }

  setPlayerVote(player, vote) {
    this.votes[player.id] = vote
  }

  setPoll(poll) {
    this.poll = poll
  }

  addFaction(faction) {
    this.factionSlots.push(faction)
  }

  getFaction(faction) {
    if (!isNaN(faction) && +faction > 0) {
      if (faction <= this.factionSlots.length) {
        return this.factionSlots[faction - 1]
      }
    }
    return this.factionSlots.find(slot => slot.match(faction))
  }

  factionExists(faction) {
    return this.factionSlots.includes(faction)
  }

  removeFaction(faction) {
    this.factionSlots = this.factionSlots.filter(slot => slot != faction)
  }

  clearFactions() {
    this.factionSlots = []
  }

  calculateDiplomacy() {
    const players = this.playerHashToList()
    const allies = {}
    const onesided = []
    const alreadyCounted = {}
    for (let player of players) {
      for (let allyId of player.getAllies()) {
        const ally = this.getPlayerFromId(allyId)
        if (!ally) continue
        if (alreadyCounted[[player.id, allyId]]) continue
        alreadyCounted[[allyId, player.id]] = true
        if (ally.isAlly(player.id)) {
          allies[[player.id, ally.id]] = [player, ally]
        } else {
          onesided.push([player.id, ally.id])
        }
      }
    }

    const loners = []
    for (let player of players) {
      let loner = true
      for (let alliance of Object.values(allies)) {
        for (let ally of alliance) {
          if (ally.id === player.id) {
            loner = false
            break
          }
        }
      }
      if (loner) {
        loners.push(player.id)
      }
    }

    const alliances = bronKerbosch(allies)
    this.diplomacy = { alliances, onesided, loners }
  }


  pingNotPlayed() {
    const text = this.pingPlayers(function(player) {
      if (player.alive && !player.rolled) {
        return `${player.ping()} `
      }
    })    
    return text || "Everyone has already rolled. Mup when?";
  }

  pingAlive() {
    const text = this.pingPlayers(function(player) {
      if (player.alive) {
        return `${player.ping()} `
      }
    })    
    return text || "War leads nowhere. Everyone is dead.";
  }

  pingEveryone() {
    const text = this.pingPlayers(function(player) {
      return `${player.ping()} `
    })    
    return text;
  }

  pingPlayers(callback) {
    let text = ""
    if (!Object.keys(this._players).length) {
      return "Nobody is playing yet."
    }
    for (let player of this.playerHashToList()) {
      text += callback(player) || ""
    }
    return text
  }

  
}