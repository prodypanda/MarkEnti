const Order = require('../models/order.model')
const User = require('../models/user.model')

/**
 * Retrieves registration statistics from a MongoDB collection and sends them as a JSON response.
 * @param {object} req - The request object containing information about the HTTP request.
 * @param {object} res - The response object used to send the JSON response.
 * @returns {Promise<void>} - A promise that resolves with the registration statistics as a JSON response.
 */
// GET /api/analytics/registration-stats?sortBy=created_at&sortOrder=asc&limit=10
exports.getRegistrationStats = async (req, res) => {
  try {
    const { sortBy, sortOrder, limit } = req.query

    // Validate sortOrder (asc or desc)
    const validSortOrder = ['asc', 'desc'].includes(sortOrder)
      ? sortOrder
      : 'asc'

    // Build the aggregation pipeline
    const pipeline = [
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          // Dynamically set the sort field and order
          [sortBy || '_id']: validSortOrder === 'asc' ? 1 : -1,
        },
      },
    ]

    // Apply limit if provided
    if (limit && !isNaN(limit)) {
      pipeline.push({ $limit: Number(limit) })
    }

    const stats = await User.aggregate(pipeline)

    // if (stats.length === 0) {
    //   res.json([])
    // } else {
    //   res.json(stats)
    // }
    res.json(stats.length === 0 ? [] : stats)
  } catch (error) {
    console.error('Error retrieving registration statistics:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
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
