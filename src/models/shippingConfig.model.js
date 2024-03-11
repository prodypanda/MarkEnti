const mongoose = require('mongoose')

const shippingConfigSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['flat_rate', 'vendor_paid', 'free'],
      required: true
    },
    cost: {
      type: Number,
      required: function () {
        return this.type === 'flat_rate'
      },
      default: 0
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

const ShippingConfig = mongoose.model('ShippingConfig', shippingConfigSchema)

module.exports = ShippingConfig
