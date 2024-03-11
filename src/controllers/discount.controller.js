const Discount = require('../models/discount.model')
const Product = require('../models/product.model')

exports.createDiscount = async (req, res) => {
  try {
    const {
      productId,
      discountPercentage,
      startDate,
      endDate,
      isActive = false,
      maxUsage = 0,
      usageCount = 0,
    } = req.body

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    let discount = new Discount({
      productId,
      discountPercentage,
      startDate,
      endDate,
      isActive,
      maxUsage,
      usageCount,
    })
    discount = await discount.save()

    res.status(201).json(discount)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params
    const {
      discountPercentage,
      startDate,
      endDate,
      isActive,
      maxUsage,
      usageCount,
    } = req.body

    // skipcq: JS-0242
    let discount = await Discount.findById(id)
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' })
    }

    discount.discountPercentage = discountPercentage
    discount.startDate = startDate
    discount.endDate = endDate
    discount.isActive = isActive
    discount.maxUsage = maxUsage
    discount.usageCount = usageCount
    await discount.save()

    res.status(200).json(discount)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// exports.deactivateDiscounts = async () => {
//   try {
//     // Deactivating all discounts that have expired
//     await Discount.updateMany({ endDate: { $lt: new Date() } }, { isActive: false });
//   } catch (error) {
//     console.error(error);
//   }
// };

exports.deactivateDiscounts = async () => {
  try {
    // await Discount.updateMany({ endDate: { $lt: new Date().toISOString() } }, { $set: { isActive: false }  });

    // Deactivating all discounts that have expired or reached their maximum usage count
    const conditions = [
      { endDate: { $lt: new Date().toISOString() }, isActive: true }, // x AND x
      { usageCount: { $lt: maxUsage }, isActive: true }, // y AND y
    ]
    // Use the UTC date for consistency across different server timezones
    const result = await Discount.updateMany(
      { $or: conditions }, // x AND x OR y AND y
      { $set: { isActive: false } }
    )
    console.log(`${result.nModified} discounts have been deactivated.`)
    console.log(`${result.modifiedCount} discounts have been deactivated.`)

    console.log('Expired discounts have been deactivated.')
  } catch (error) {
    console.error('Error deactivating expired discounts:', error)
  }
}
