const Discount = require('../models/discount.model')

const applyActiveDiscount = async (product) => {
  const discount = await Discount.findOne({
    productId: product._id,
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  })

  if (discount) {
    product.price = product.price * ((100 - discount.discountPercentage) / 100)
  }

  return { product, discount }
}

module.exports = {
  applyActiveDiscount
}
