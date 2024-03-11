const Order = require('../models/order.model')

const getSalesReport = async (req, res) => {
  const { startDate, endDate } = req.query

  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalOrders: 1
        }
      }
    ])

    const report = salesData[0] || { totalSales: 0, totalOrders: 0 }

    res.status(200).json({
      report
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error generating sales report: ' + error.message })
  }
}

module.exports = {
  getSalesReport
}
