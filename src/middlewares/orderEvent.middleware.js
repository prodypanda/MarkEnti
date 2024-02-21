const preferenceService = require('../services/preference.service')
const Order = require('../models/order.model')

exports.calculatePreferencesOnOrderCompletion = async (req, res, next) => {
  if (req.body.status === 'completed' || req.body.status === 'shipped') {
    try {
      const order = await Order.findById(req.params.id)
      const preferences = await preferenceService.calculatePreferences(
        order.customer
      )
      req.body.preferences = preferences // Append the calculated preferences to the request body
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error calculating preferences. ' + error })
    }
  }
  next()
}
