const Player = require("./player");
const bronKerbosch = require("../utils/bronkerbosch");
const discordUtils = require("../utils/discord");
const HistoryEntry = require("./history_entry");

module.exports = class Turn {
  constructor(_database, mup = "", description = "", number = 0, players = null, factionSlots = null, diplomacy = null, pacts = null, lurkers = null, rolls = null, poll = "", votes = null, cedes = null, cedeMessages = null, history = null, startedAt = null) {
    this._database = _database
    this.description = description
    this.mup = mup
    this.number = number
    this.poll = poll
    this.votes = votes || {}
    this.factionSlots = factionSlots || []
    this.diplomacy = diplomacy
    this.pacts = pacts
    this.lurkers = lurkers || []
    this.cedes = cedes || []
    this.cedeMessages = cedeMessages || []
    this.history = history || []
    this.startedAt = startedAt
    this._players = players || {}
    this._rolls = rolls || []
  }

  static fromPreviousTurn(_database, previous, mup, description, factionSlots, diplomacy, pacts, lurkers) {
    return new Turn(
      _database,
      mup,
      description,
      (previous.number || 0) + 1,
      this.playersToNewTurn(previous._players),
      factionSlots,
      diplomacy,
      pacts,
      lurkers
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

  getAllPlayerIds() {
    return Object.values(this._players).map(player => { return player.id });
  }

  isLurker(userId) {
    return this.lurkers.findIndex(([id]) => id === userId) !== -1
  }

  addPlayer(discordUser, factionName) {
    const faction = factionName ? this.getAndRemoveFactionIfExists(factionName) : ""
    this._players[discordUser.id] = new Player(discordUser, faction)
    this.addHistory(HistoryEntry.join(discordUser.id, factionName))
    this.removeLurker(discordUser)
    return this._players[discordUser.id]
  }

  addLurker(discordUser, factionName) {
    if (!discordUser || !discordUser.id) return
    if (!this.lurkers) this.lurkers = []
    const idx = this.lurkers.findIndex(([id]) => id === discordUser.id)
    if (idx !== -1) {
      this.lurkers[idx][1] = factionName
    } else {
      this.lurkers.push([discordUser.id, factionName])
    }
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
    this.breakAlliancesAndNAPFromPlayer(player)
    this.calculateDiplomacy()
    this.addHistory(HistoryEntry.leave(player.id))
  }
  banPlayer(player) {
    this.breakAlliancesAndNAPFromPlayer(player)
    delete this._players[player.id]
    this.calculateDiplomacy()
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

  removeLurker(discordUser) {
    if (!discordUser || !discordUser.id) return false
    if (this.lurkers) {
      const index = this.lurkers.findIndex(([id]) => id === discordUser.id)
      if (index !== -1) {
        this.lurkers.splice(index, 1)
        return true
      }
    }
    return false
  }

  breakAlliancesAndNAPFromPlayer(breakingPlayer) {
    this._players[breakingPlayer.id].clearAllAlliances();
    this._players[breakingPlayer.id].clearAllNAPs();
    for (let id of this.getAllPlayerIds()) {
      this._players[id].break(breakingPlayer)
      this._players[id].betray(breakingPlayer)
    }
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
    // TODO: Temporary fix, disabling factionSlots til it calms down
    if (!Array.isArray(this.factionSlots)) { this.factionSlots = []; }
    const normalizedFaction = faction.toLowerCase()
    return this.factionSlots.find(slot => slot.toLowerCase().includes(normalizedFaction))
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
      for (let pacteeId of player.getNAPs()) {
        const pactee = this.getPlayerFromId(pacteeId)
        if (!pactee) continue
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

  listNotPlayedAtRandomOrder() {
    console.log(this.diplomacy.alliances)
    console.log(this.playerHashToList())
    let text = ''
    let count = 1
    for (let player of this.shuffle(this.playerHashToList())) {
      if (player.alive && !player.rolled) {
        text += `${count}. ${player.usernameWithFaction()}\n`
        count += 1
      }
    }
    return text || 'Everyone has already rolled.'
  }

  listAlliancesInSemiRandomOrder() {
    const players = this.playerHashToList()
      .filter(player => player.alive)
      .map(player => player.id);

    const alliances = this.diplomacy.alliances.map(alliance => alliance.filter(id => players.includes(id)));
    const lonePlayers = players.filter(p => !alliances.flat().includes(p));
    const sortedAlliances = alliances.map(alliance => this.shufflesort(alliance));
    const result = [];

    const maxLength = Math.max(lonePlayers.length, ...sortedAlliances.map(a => a.length));

    for (let i = 0; i < maxLength; i++) {
      const round = [];
      for (const alliance of sortedAlliances) {
        if (alliance[i] !== undefined) {
          round.push(alliance[i]);
        }
      }
      if (lonePlayers[i] !== undefined) {
        round.push(lonePlayers[i]);
      }
      result.push(...this.shufflesort(round));
    }

    console.log(lonePlayers);
    console.log(sortedAlliances);
    console.log(result);

    let text = ''
    let count = 1
    for (let playerId of result) {
      const player = this.getPlayerFromId(`${playerId}`)
      if (!player) continue
      text += `${count}. ${this.getPlayerFromId(`${playerId}`).usernameWithFaction()}\n`
      count += 1
    }
    return text || 'Everyone has already rolled.'
  }

  breakAllAlliances() {
    for (const player of this.playerHashToList()) {
      player.clearAllAlliances()
    }
    this.calculateDiplomacy()
  }
  
  breakAllPacts() {
    for (const player of this.playerHashToList()) {
      player.clearAllNAPs()
    }
    this.calculatePacts()
  }

  shufflesort(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  listNotPlayed() {
    const text = this.pingPlayers(function (player) {
      if (player.alive && !player.rolled) {
        return `${player.usernameWithFaction()}\n`
      }
    })
    return text || "Everyone has already rolled. Mup when?";
  }

  listBonuses() {
    let text = "";
    for (let player of this.playerHashToList()) {
      if (player.bonus) {
        text += player.usernameWithFaction() + " -- Bonus: " + player.bonus + "\n";
      }
    }
    return text || "No bonuses";
  }

  pingNotPlayed() {
    const text = this.pingPlayers(function (player) {
      if (player.alive && !player.rolled) {
        return `${player.ping()} `
      }
    })
    return text || "Everyone has already rolled. Mup when?";
  }

  pingAlive() {
    const text = this.pingPlayers(player => {
      if (player.alive) {
        return player.ping() + " "
      }
    })
    if (text && text.trim()) {
      return text + this.pingLurkers()
    }
    return "War leads nowhere. Everyone is dead."
  }

  pingEveryone() {
    const text = this.pingPlayers(player => player.ping() + " ")
    return text + this.pingLurkers()
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

  pingLurkers() {
    if (!this.lurkers || !this.lurkers.length) return ""
    return this.lurkers.map(lurker => `<@!${lurker[0]}> `).join("")
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
