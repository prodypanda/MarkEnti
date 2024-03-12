const Order = require('../models/order.model')

/**
 * Generates a sales report for the given date range.
 *
 * @param {Object} req - Express request object
 * @param {string} req.query.startDate - Start date for report period
 * @param {string} req.query.endDate - End date for report period
 * @param {Object} res - Express response object
 *
 * @returns {Promise} Promise that resolves to the generated sales report
 */
const getSalesReport = async (req, res) => {
  const { startDate, endDate } = req.query

  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalOrders: 1,
        },
      },
    ])

    const report = salesData[0] || { totalSales: 0, totalOrders: 0 }

    return res.status(200).json({
      report,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error generating sales report: ${error.message}` })
  }
}

module.exports = {
  getSalesReport,
}
