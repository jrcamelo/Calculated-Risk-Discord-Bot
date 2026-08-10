const crypto = require("crypto")
const fse = require("fs-extra")
const http = require("http")
const https = require("https")
const path = require("path")
const sanitize = require("sanitize-filename")

function uploadsBasePath() {
  return path.join(process.cwd(), process.env.DATABASE_PATH || "storage", "uploads")
}

function uploadFolder(serverId, channelId) {
  return path.join(uploadsBasePath(), String(serverId || "unknown-server"), String(channelId || "unknown-channel"))
}

function makeUploadPath(serverId, channelId, originalName = "attachment") {
  const safeName = sanitize(originalName) || "attachment"
  const unique = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`
  return path.join(uploadFolder(serverId, channelId), `${unique}-${safeName}`)
}

async function saveUrl(url, serverId, channelId, originalName) {
  const target = makeUploadPath(serverId, channelId, originalName)
  fse.ensureDirSync(path.dirname(target))
  await download(url, target)
  return path.relative(process.cwd(), target)
}

function download(url, target) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http
    const request = client.get(url, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume()
        return download(response.headers.location, target).then(resolve, reject)
      }
      if (response.statusCode !== 200) {
        response.resume()
        return reject(new Error(`Download failed with status ${response.statusCode}`))
      }

      const file = fse.createWriteStream(target)
      response.pipe(file)
      file.on("finish", () => file.close(resolve))
      file.on("error", reject)
    })
    request.on("error", reject)
  })
}

function isLocalUpload(value) {
  if (!value || typeof value !== "string") return false
  const resolved = path.resolve(process.cwd(), value)
  const base = path.resolve(uploadsBasePath())
  return resolved === base || resolved.startsWith(base + path.sep)
}

function fileName(value) {
  return sanitize(path.basename(value)) || "mup.png"
}

function attachmentUrl(value) {
  return `attachment://${fileName(value)}`
}

function filePayload(value) {
  if (!isLocalUpload(value)) return null
  return { attachment: path.resolve(process.cwd(), value), name: fileName(value) }
}

module.exports = {
  attachmentUrl,
  filePayload,
  isLocalUpload,
  saveUrl,
}
