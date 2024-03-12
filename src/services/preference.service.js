const Order = require('../models/order.model')
// const Product = require('../models/product.model')

/**
 * Calculates the unique product categories that a customer has ordered.
 *
 * @param {string} customerId - The ID of the customer to get orders for.
 * @returns {Promise<string[]>} A promise that resolves to an array of unique category strings.
 */
const calculatePreferences = async (customerId) => {
  try {
    const orders = await Order.find({ customer: customerId }).populate(
      'products.product'
    )
    const categories = new Set()
    orders.forEach((order) => {
      order.products.forEach((orderProduct) => {
        if (orderProduct.product?.category) {
          categories.add(orderProduct.product.category.toString())
        }
      })
    })

    return Array.from(categories)
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  calculatePreferences,
}
