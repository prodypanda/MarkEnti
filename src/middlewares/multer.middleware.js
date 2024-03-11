const multer = require('multer')
const sharp = require('sharp')
const uuid = require('uuid').v4

const storage = multer.memoryStorage()

exports.uploadSingleImage = multer({ storage }).single('image')

exports.resizeAndFormatImage = async (req, res, next) => {
  if (!req.file) return next()

  req.file.filename = `category-${uuid()}.jpeg`

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/${req.file.filename}`)

  next()
}
