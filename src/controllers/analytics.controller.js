const Order = require('../models/order.model')
const User = require('../models/user.model')

exports.getRegistrationStats = async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
        count: { $sum: 1 },
      },
    },
  ])
  res.json(stats)
}

exports.getSalesStats = async (req, res) => {
  const stats = await Order.aggregate([
    { $match: { status: 'delivered' } },
    {
      $group: {
        _id: '$date',
        totalSales: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])
  res.json(stats)
}

const { getPaymentFailures } = require('../services/paymentFailure.service.js')

exports.getPaymentFailureAnalytics = async (req, res) => {
  try {
    const failures = await getPaymentFailures()
    res.status(200).json({
      failureCount: failures.length,
      reasons: failures.map((f) => f.reason),
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error getting payment failure analytics:', error })
  }
}
