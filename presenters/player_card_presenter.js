const Jimp = require('jimp')
const fse = require('fs-extra')
const GetPlayerStats = require('../tasks/server/get/GetPlayerStats')
const PlayerStats = require('../models/player_stats')

const MASK_PATH = './assets/images/profile_mask.png'
const CARD_PATH = './assets/images/profile_background.png'
const BAR_PATH = './assets/images/bar.png'
const BLANK_PATH = './assets/images/blank.png'

const TEMP_FOLDER_PATH = './assets/temporary/'

const FONTS = {
  NORMAL: './assets/fonts/normal.fnt',
  BIG: './assets/fonts/big.fnt',
  BIGGER: './assets/fonts/bigger.fnt',
}

const WIDTH = 427
const HEIGHT = 160
const BAR_WIDTH = 290
const BAR_HEIGHT = 28

module.exports = class PlayerCardPresenter {
  constructor(server, serverId, playerId) {
    this.server = server;
    this.serverId = serverId
    this.playerId = playerId
  }

  async getPlayerStats() {
    const task = new GetPlayerStats(this.serverId, this.playerId)
    const stats = await task.tryExecute()
    if (!stats) return
    this.stats = PlayerStats.fromDb(stats)
    return this.stats
  }

  async getDiscordUser(server) {
    const member = await server.members.fetch(this.playerId)
    if (!member || !member.user) return
    this.user = member.user
    return this.user
  }

  getAvatarUrl() {
    return this.user.avatarURL({ format: 'png'})
  }

  getResultPath() {
    return TEMP_FOLDER_PATH + this.playerId + '.png'
  }

  async makeCard() {
    await this.load()
    await this.prepareAvatar()
    await this.prepareBackground()
    this.resizeAndPrint()
    this.card.composite(this.avatar, 20, 21)
    this.background.composite(this.card, 0, 0)
    await this.background.writeAsync(this.getResultPath())
    return this.getResultPath()
  }

  async load() {
    this.font = await Jimp.loadFont(FONTS.NORMAL)
    this.fontBig = await Jimp.loadFont(FONTS.BIG)
    this.fontBigger = await Jimp.loadFont(FONTS.BIGGER)
    this.blank = await Jimp.read(BLANK_PATH)
    this.bar = await Jimp.read(BAR_PATH)
    this.card = await Jimp.read(CARD_PATH)
    this.avatarMask = await Jimp.read(MASK_PATH)
    this.avatar = await Jimp.read(this.getAvatarUrl())
  }

  async prepareAvatar() {
    this.avatarMask.resize(90, 90)
    this.avatar.resize(90, 90)
    this.avatar.mask(this.avatarMask)
  }

  async prepareBackground() {
    this.background = await this.blank.clone()
    this.background.resize(WIDTH, HEIGHT)
    const barWidth = (this.stats.currentXp / (this.stats.nextLevelXp+1) * BAR_WIDTH) + 1
    this.bar.resize(barWidth, BAR_HEIGHT)
    this.background.composite(this.bar, 117, 128)
  }

  resizeAndPrint() {
    const maxX = WIDTH
    const maxY = 0
    const right = maxX
    const center = maxX/2
    this.card.resize(WIDTH, HEIGHT)
    this.card.print(this.fontBig, 395 - right, 16, this.alignRight(this.user.username + ' #' + this.user.discriminator), maxX, maxY)
    this.card.print(this.fontBig, 260 - center, 52, this.alignCenter(this.makeWinsGamesText()), maxX, maxY)
    this.card.print(this.font, 191 - center, 78, this.alignCenter(this.makeRollsText()), maxX, maxY)
    this.card.print(this.font, 334 - center, 78, this.alignCenter(this.makeLuckText()), maxX, maxY)
    this.card.print(this.font, 126, 116, this.alignLeft(this.makeScoreText()), maxX, maxY)
    this.card.print(this.font, 395 - right, 116, this.alignRight(this.makeXPText()), maxX, maxY)
    this.card.print(this.fontBigger, 51, 136, this.alignLeft(this.stats.level.toString()), maxX, maxY)
  }

  deleteImage() {
    try {
      fse.removeSync(this.getResultPath())
    } catch (e) {
      console.log("ERROR: Delete profile card image")
      console.log(e)
    }
  }

  makeWinsGamesText() {
    const wins = this.stats.wins
    const games = this.stats.games
    return `${wins} Wins / ${games} Games`
  }

  makeRollsText() {
    const rolls = this.stats.totalRolls
    return `${rolls} Rolls`
  }

  makeLuckText() {
    const luck = this.stats.luck || 0
    return `${luck.toFixed(0)} Luck`
  }

  makeScoreText() {
    const score = this.stats.totalScore
    return `${score}pts.`
  }

  makeXPText() {
    const nextLevelXp = this.stats.nextLevelXp
    const currentXp = this.stats.currentXp
    return `${currentXp} / ${nextLevelXp} XP`
  }

  alignCenter(text) {
    return {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }
  }
  alignRight(text) {
    return {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }
  }
  alignLeft(text) {
    return {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }
  }
}