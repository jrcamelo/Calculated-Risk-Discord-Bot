const { GifFrame, GifUtil, GifCodec } = require('gifwrap');
const Jimp = require('jimp');
const fse = require('fs-extra');
const ImageDownloader = require('image-downloader');

module.exports = class GifMaker {
  constructor(serverId, gameId, mups, delay = 1000) {
    this.serverId = serverId
    this.gameId = gameId;
    this.links = mups;
    this.gifFrames = []
    this.delay = delay
  }

  getFolderPath() {
    const path = `./storage/gifs/${this.serverId}/${this.gameId}/`
    fse.ensureDirSync(path)
    return path
  }

  getDownloadFolderPath() {
    const path = `./storage/gifs/${this.serverId}/${this.gameId}/downloads/`
    fse.ensureDirSync(path)
    return path
  }

  getGifPath() {
    return `${this.getFolderPath()}${this.gameId}.gif`
  }

  async makeGif(callback) {
    console.log(`Making gif for ${this.serverId} ${this.gameId}...`)
    await this.downloadMups()
    await this.makeGifFrames()
    if (this.gifFrames.length === 0) return callback()
    await this.writeGif()
    console.log("Done!")
    await callback(this.getGifPath())
  }

  async downloadMups() {
    for (let i = 0; i < this.links.length; i++) {
      const link = this.links[i];
      const options = {
        url: link,
        dest: `${this.getDownloadFolderPath()}${i}.jpg`
      }
        await ImageDownloader.image(options)
    }
  }

  async makeGifFrames() {
    for (let i = 0; i < this.links.length; i++) {
      const image = await this.treatImage(i)
      const frame = new GifFrame(image.bitmap, { delayCentisecs: this.delay / 10 })
      this.gifFrames.push(frame)
    }
  }

  async treatImage(i) {
    const image = await Jimp.read(`${this.getDownloadFolderPath()}${i}.jpg`)
    const width = Math.min(image.bitmap.width, 800)
    await image.resize(width, Jimp.AUTO)
    await image.quality(60)
    await GifUtil.quantizeSorokin(image, 255)
    return image
  }

  async writeGif() {
    await GifUtil.write(this.getGifPath(), this.gifFrames, { loop: true })
    fse.removeSync(this.getDownloadFolderPath())
  }
}


 