const { GifFrame, GifUtil, GifCodec } = require('gifwrap');
const Jimp = require('jimp');
const sharp = require('sharp');
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

  getResizedFolderPath() {
    const path = `./storage/gifs/${this.serverId}/${this.gameId}/downloads_resized/`
    fse.ensureDirSync(path)
    return path
  }

  getGifPath() {
    return `${this.getFolderPath()}${this.gameId}.gif`
  }

  async makeGif(callback) {
    console.log(`Making gif for ${this.serverId} ${this.gameId}...`)
    await this.downloadMups()
    console.log(this.links)
    await this.makeGifFrames()
    if (this.gifFrames.length === 0) return callback()
    await this.writeGif()
    console.log("Done!")
    await callback(this.getGifPath())
  }

  async downloadMups() {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    for (let i = 0; i < this.links.length; i++) {
      const link = this.links[i];      
      const path = new URL(link).pathname.split('?')[0];
      const extension = path.split('.').pop();

      if (imageExtensions.includes(extension)) {
        const options = {
          url: link,
          dest: `${this.getDownloadFolderPath()}${i}.jpg`
        }
        await ImageDownloader.image(options)
      } else {
        console.log("Skipping gif frame: " + link)
      }
    }
  }

  async makeGifFrames() {
    for (let i = 0; i < this.links.length; i++) {
      try {
        const image = await this.treatImage(i)
        const frame = new GifFrame(image.bitmap, { delayCentisecs: this.delay / 10 })
        this.gifFrames.push(frame)
      } catch(error) {
        console.log(`An error occurred while making gif frames: ${error.message}`);
      }
    }
  }

  async treatImage(i) {
    const downloadPath = `${this.getDownloadFolderPath()}${i}.jpg`
    const resizedPath = `${this.getResizedFolderPath()}${i}.jpg`
    await sharp(downloadPath).resize({ width: 800 }).toFile(resizedPath)
    const image = await Jimp.read(resizedPath)
    await image.quality(50)
    await GifUtil.quantizeSorokin(image, 255)
    return image
  }

  async writeGif() {
    await GifUtil.write(this.getGifPath(), this.gifFrames, { loop: true })
    fse.removeSync(this.getDownloadFolderPath())
  }
}


 