const Discount = require('../models/discount.model')
const Product = require('../models/product.model')

exports.createDiscount = async (req, res) => {
  try {
    const {
      productId,
      discountPercentage = 100,
      startDate = Date.now(),
      endDate = Date.now() + 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds,
      isActive = false,
      maxUsage = 1
      // usageCount = 0,
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
      maxUsage
      // usageCount,
    })
    discount = await discount.save()

    return res.status(201).json(discount)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params
    const {
      productId,
      discountPercentage,
      startDate,
      endDate,
      isActive,
      maxUsage,
      usageCount
    } = req.body

    // skipcq: JS-0242
    const discount = await Discount.findById(id)
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' })
    }

    if (productId) {
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      } else {
        discount.productId = productId
      }
    }

    discount.discountPercentage = discountPercentage
    discount.startDate = startDate
    discount.endDate = endDate
    discount.isActive = isActive
    discount.maxUsage = maxUsage
    discount.usageCount = usageCount
    await discount.save()

    return res.status(200).json(discount)
  } catch (error) {
    return res.status(500).json({ message: error.message })
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
    // Use aggregation to update discounts directly in the database
    const result = await Discount.updateMany(
      {
        $or: [
          { endDate: { $lt: new Date().toISOString() }, isActive: true },
          { $expr: { $gte: ['$usageCount', '$maxUsage'] }, isActive: true }
          // { usageCount: { $gte: '$maxUsage' }, isActive: true }, // Use $gte to compare with maxUsage field
        ]
      },
      { $set: { isActive: false } }
    )

    if (result) {
      console.log(
        `${result.modifiedCount} Expired or Max Usage Reached discounts have been deactivated.`
      )
    } else {
      console.log('No discounts have been deactivated.')
    }
  } catch (error) {
    console.error('Error deactivating expired discounts:', error)
  }
}

exports.getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find()
    return res.status(200).json(discounts)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getDiscountById = async (req, res) => {
  try {
    const { id } = req.params
    const discount = await Discount.findById(id)
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' })
    }
    return res.status(200).json(discount)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

//
exports.useDiscount = async (req, res) => {
  try {
    const { id } = req.params
    const discount = await Discount.findById(id)
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' })
    }
    if (discount.isActive === false) {
      return res.status(403).json({
        message:
          'Discount usage limit reached or expired! Please try another discount.'
      })
    }
    discount.usageCount += 1
    await discount.save()
    return res.status(200).json(discount)
    // return res.status(200).json({ message: 'Discount used' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
