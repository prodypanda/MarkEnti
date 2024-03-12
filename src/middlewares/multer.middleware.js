const multer = require('multer')
const sharp = require('sharp')
const uuid = require('uuid').v4

const storage = multer.memoryStorage()

exports.uploadSingleImage = multer({ storage: storage }).single('image')

/**
 * Resize and format the uploaded image.
 *
 * This middleware resizes the uploaded image to 500x500 pixels, converts it to JPEG format,
 * sets the quality to 90%, and saves it to the public/images folder with a random UUID filename.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
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
