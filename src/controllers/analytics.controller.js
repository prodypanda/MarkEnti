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

    // Validate sortBy (_id or desc)
    const validsortBy = ['_id', 'count'].includes(sortBy) ? sortBy : '_id'

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
          [validsortBy || '_id']: validSortOrder === 'asc' ? 1 : -1,
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
  try {
    const { groupBy, status, sortBy, sortOrder, limit } = req.query

    // Validate sortOrder (asc or desc)
    const validSortOrder = ['asc', 'desc'].includes(sortOrder)
      ? sortOrder
      : 'asc'

    // Validate sortBy (_id or desc)
    const validsortBy = ['_id', 'totalSales', 'totalOrders'].includes(sortBy)
      ? sortBy
      : '_id'

    // Validate status (_id or desc)
    const validstatus = [
      'all',
      'failed',
      'pending',
      'paid',
      'refunded',
      'processing',
      'cancelled',
      'delivered',
      'completed',
    ].includes(status)
      ? status
      : 'all'

    // Validate groupBy (createdAt, status)
    const validGroupBy = ['createdAt', 'status'].includes(groupBy)
      ? groupBy
      : 'createdAt'

    // Build the aggregation pipeline
    const pipeline = [
      // { $match: { status: 'pending' } }, // Filter by status
      // Filter by status (if provided)
      ...(status && status !== 'all'
        ? [{ $match: { status: validstatus } }]
        : []), // Use spread syntax to conditionally add the $match stage to the pipeline
    ]

    if (validGroupBy === 'createdAt') {
      pipeline.push({
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      })
    } else if (validGroupBy === 'status') {
      pipeline.push({
        $group: {
          _id: '$status',
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      })
    } else {
      // Default grouping by date
      pipeline.push({
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      })
    }

    // Sort the results
    pipeline.push({
      $sort: {
        [validsortBy || '_id']: validSortOrder === 'asc' ? 1 : -1,
      },
    })

    // Apply limit if provided
    if (limit && !isNaN(limit)) {
      pipeline.push({ $limit: Number(limit) })
    }

    const stats = await Order.aggregate(pipeline)

    // if (stats.length === 0) {
    //   res.json([])
    // } else {
    //   res.json(stats)
    // }
    res.json(stats.length === 0 ? [] : stats)
  } catch (error) {
    console.error('Error retrieving sales statistics:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
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
