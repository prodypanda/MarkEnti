const cartService = require('../services/cart.service')
const guestCartService = require('../services/guestCart.service.js')
const Product = require('../models/product.model')

exports.addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: 'Product ID and quantity are required.' })
    }

    const token = determineToken(req)
    const cartServiceToUse = req.user ? cartService : guestCartService
    const cartMethod = req.user ? 'addItemToCart' : 'addItemToGuestCart'
    const identifier = req.user ? req.user.id : token

    const updatedCart = await cartServiceToUse[cartMethod](
      identifier,
      productId,
      quantity
    )
    return res.status(201).json(updatedCart || [])
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

function determineToken(req) {
  let token = req.user ? req.user.id : req.cookies['XSRF-TOKEN']
  // If the user is not authenticated and no token is present, generate a new one.
  if (!req.user && !token) {
    token = req.csrfToken()
  }
  return token
}

exports.viewCart = async (req, res) => {
  try {
    const token = determineToken(req)
    let cartResponse = []

    // Determine the service and method to use based on whether the user is authenticated
    const cartServiceToUse = req.user ? cartService : guestCartService
    const cartMethod = req.user ? 'viewCart' : 'getGuestCart'
    const identifier = req.user ? req.user : token

    // Fetch the cart using the determined service and method
    const cart = await cartServiceToUse[cartMethod](identifier)
    if (cart) {
      cartResponse = cart
    }

    res.status(200).json(cartResponse)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Ensure determineToken is defined only once and used consistently
function determineToken(req) {
  // If the user is authenticated, use the user's ID; otherwise, use the XSRF-TOKEN cookie or generate a new token
  return req.user ? req.user.id : req.cookies['XSRF-TOKEN'] || req.csrfToken()
}

exports.removeItemFromCart = async (req, res) => {
  try {
    const productId = req.params.id
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' })
    }

    const token = determineToken(req)
    const updatedCart = await removeItem(token, productId, req.user)
    if (!updatedCart) {
      return res.status(404).json({ message: 'Item not found in cart.' })
    }

    res.status(200).json(updatedCart)
  } catch (error) {
    handleRemoveItemError(error, res)
  }
}

async function removeItem(token, productId, user) {
  const cartServiceToUse = user ? cartService : guestCartService
  const cartMethod = user ? 'removeItemFromCart' : 'removeItemFromGuestCart'
  const identifier = user ? user.id : token

  return await cartServiceToUse[cartMethod](identifier, productId)
}

function handleRemoveItemError(error, res) {
  if (
    error.message === 'Cart not found' ||
    error.message === 'Item not found in cart.'
  ) {
    res.status(404).json({ message: error.message })
  } else {
    res.status(500).json({ message: error.message })
  }
}

exports.clearCart = async (req, res) => {
  try {
    if (req.user) {
      const cleanUserCart = await cartService.clearCart(req.user)
      res
        .status(200)
        .json({ message: 'Cart cleared successfully', cleanUserCart }) // Send response in the controller
    } else {
      let token = req.cookies['XSRF-TOKEN']
      if (!token) {
        token = req.csrfToken
      }
      const cleanGuestCart = await guestCartService.clearGuestCart(token)
      res
        .status(200)
        .json({ message: 'Cart cleared successfully ', cleanGuestCart }) // Send response in the controller
    }
  } catch (error) {
    if (error.message === 'Cart not found') {
      res.status(404).json({ message: error.message })
    } else {
      res.status(500).json({ message: error.message })
    }
  }
}
