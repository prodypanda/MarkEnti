const Product = require('../models/product.model')

exports.updateInventory = async (req, res) => {
  const { id, count } = req.body
  try {
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    product.inventoryCount = count
    await product.save()

    res.status(200).json({
      message: 'Inventory updated',
      inventoryCount: product.inventoryCount
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getInventory = async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findById(id).select('inventoryCount')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
