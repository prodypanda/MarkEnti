const cartService = require('../services/cart.service')
const Product = require('../models/product.model')

exports.viewCart = async (req, res) => {
  try {
    const cart = await cartService.viewCart(req.user.id)
    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const cart = await cartService.addItemToCart(
      req.user.id,
      productId,
      quantity,
      product.price
    )
    res.status(201).json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.removeItemFromCart = async (req, res) => {
  try {
    const cart = await cartService.removeItemFromCart(
      req.user.id,
      req.params.id
    )
    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
