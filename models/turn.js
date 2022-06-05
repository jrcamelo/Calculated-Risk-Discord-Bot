const Player = require("./player");
const bronKerbosch = require("../utils/bronkerbosch");
const HistoryEntry = require("./history_entry");

module.exports = class Turn {
  constructor(_database, mup = "", description = "", number = 0, players = null, history = null, factionSlots = null, diplomacy=null, pacts=null, rolls = null, poll = "", votes = null, cedes = null, cedeMessages = null) {
    this._database = _database
    this.description = description
    this.mup = mup
    this.number = number
    this.history = history || []
    this.poll = poll
    this.votes = votes || {}
    this.factionSlots = factionSlots || []
    this.diplomacy = diplomacy
    this.pacts = pacts
    this.cedes = cedes || []
    this.cedeMessages = cedeMessages || []
    this._players = players || {}
    this._rolls = rolls || []
  }

  static fromPreviousTurn(_database, previous, mup, description, factionSlots, diplomacy, pacts) {
    return new Turn(
      _database,
      mup,
      description,
      (previous.number || 0) + 1,
      this.playersToNewTurn(previous._players),
      factionSlots,
      diplomacy,
      pacts,
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

  addHistory(entry) {
    this.history.push(entry)
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
    this.addHistory(HistoryEntry.join(discordUser.id, factionName))
    return this._players[discordUser.id]
  }

  renamePlayer(player, factionName) {
    player.name = factionName ? this.getAndRemoveFactionIfExists(factionName) : ""
    this.addHistory(HistoryEntry.rename(player.id, factionName))
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
    this.addHistory(HistoryEntry.leave(player.id))
  }
  banPlayer(player) {
    delete this._players[player.id]
    this.addHistory(HistoryEntry.leave(player.id))
  }

  killPlayer(player) {
    player.alive = false
    this.calculateDiplomacy()
    this.addHistory(HistoryEntry.kill(player.id))
  }
  revivePlayer(player) {
    player.alive = true
    player.removed = false;
    this.calculateDiplomacy()
    this.addHistory(HistoryEntry.revive(player.id))
  }

  addRoll(roll) {
    this._rolls.push(roll)
    this._players[roll.playerId].rolled = true
    if (!this._players[roll.playerId].rollTime) {
      this._players[roll.playerId].rollTime = roll.time;
    }
    this.addHistory(HistoryEntry.roll(roll.playerId, roll.formattedValue, roll.intention))
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
    return this.playerHashToList().every(player => player.rolled || !player.alive)
  }

  setPlayerVote(player, vote) {
    this.votes[player.id] = vote
    this.addHistory(HistoryEntry.vote(player.id, vote))
  }

  setPoll(poll) {
    this.poll = poll
  }

  addCede(cede, playerId) {
    this.cedes.push(cede)
    let cleanCede = cede.replace(/\n/g, " ")
    let summary = cede.split("\n")[0]
    if (summary.endsWith(":")) {
      summary = summary.substring(0, summary.length - 1)
    }
    this.addHistory(HistoryEntry.cede(playerId, cleanCede, summary))
  }

  addCedeMessage(message) {
    this.cedeMessages.push(message)
  }

  addFaction(faction) {
    this.factionSlots.push(faction)
  }

  getFaction(faction) {
    if (faction && !isNaN(faction) && +faction > 0) {
      if (faction <= this.factionSlots.length) {
        return this.factionSlots[faction - 1]
      }
    }
    return this.factionSlots.find(slot => slot.toLowerCase().match(faction.toLowerCase()))
  }

  factionExists(faction) {
    return this.factionSlots.includes(faction)
  }

  removeFaction(faction) {
    if (!faction) return
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
      if (!player.alive) continue
      for (let allyId of player.getAllies()) {
        const ally = this.getPlayerFromId(allyId)
        if (!ally || !ally.alive) continue
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
      if (loner && player.alive) {
        loners.push(player.id)
      }
    }

    const alliances = bronKerbosch(allies)
    this.diplomacy = { alliances, onesided, loners }
  }

  calculatePacts() {
    const players = this.playerHashToList()
    const pacts = {}
    const onesided = []
    const alreadyCounted = {}
    for (let player of players) {
      if (!player.alive) continue
      for (let pacteeId of player.getNAPs()) {
        const pactee = this.getPlayerFromId(pacteeId)
        if (!pactee || !pactee.alive) continue
        if (alreadyCounted[[player.id, pacteeId]]) continue
        alreadyCounted[[pacteeId, player.id]] = true
        if (pactee.isNAP(player.id)) {
          pacts[[player.id, pactee.id]] = [player, pactee]
        } else {
          onesided.push([player.id, pactee.id])
        }
      }
    }

    const alliances = bronKerbosch(pacts)
    this.pacts = { alliances, onesided }
  }

  listNotPlayed() {
    const text = this.pingPlayers(function(player) {
      if (player.alive && !player.rolled) {
        return `${player.usernameWithFaction()}\n`
      }
    })    
    return text || "Everyone has already rolled. Mup when?";
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

  saveAddendum(player, addendum) {
    this.addHistory(HistoryEntry.say(player.id, addendum))
  }

  saveAllyHistory(player, ally) {
    this.addHistory(HistoryEntry.ally(player.id, ally.id))
  }
  
  saveBetrayHistory(player, ally) {
    this.addHistory(HistoryEntry.betray(player.id, ally.id))
  }

  saveNapHistory(player, nap) {
    this.addHistory(HistoryEntry.nap(player.id, nap.id))
  }

  saveBreakHistory(player, nap) {
    this.addHistory(HistoryEntry.break(player.id, nap.id))
  }
}