const mongoose = require('mongoose')
/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentFailure:
 *       type: object
 *       required:
 *         - orderId
 *         - reason
 *       properties:
 *         orderId:
 *           type: string
 *           description: The ID of the order associated with the payment failure
 *         reason:
 *           type: string
 *           description: The reason for the payment failure
 *         occurredAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the payment failure occurred
 *       example:
 *         orderId: 5e2e7ad90d23c9487402eaa2
 *         reason: Invalid credit card number
 *         occurredAt: 2020-01-27T14:23:41.382Z
 */

/**
 * Schema for payment failure documents.
 * Defines the shape of documents in the paymentFailures collection.
 */
const paymentFailureSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    occurredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const PaymentFailure = mongoose.model('PaymentFailure', paymentFailureSchema)

module.exports = PaymentFailure
