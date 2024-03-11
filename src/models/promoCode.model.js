const mongoose = require('mongoose')

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    expirationDate: {
      type: Date
    },
    isEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

const PromoCode = mongoose.model('PromoCode', promoCodeSchema)

module.exports = PromoCode
