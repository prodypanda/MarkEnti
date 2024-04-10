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

    let cartResponse = []
    let token = req.user ? req.user.id : req.cookies['XSRF-TOKEN']

    // If the user is not authenticated and no token is present, generate a new one.
    if (!req.user && !token) {
      token = req.csrfToken()
    }

    // Determine the cart service to use based on whether the user is authenticated.
    const cartServiceToUse = req.user ? cartService : guestCartService
    const cartMethod = req.user ? 'addItemToCart' : 'addItemToGuestCart'
    const identifier = req.user ? req.user.id : token

    const updatedCart = await cartServiceToUse[cartMethod](
      identifier,
      productId,
      quantity
    )
    if (updatedCart) {
      cartResponse = updatedCart
    }

    return res.status(201).json(cartResponse)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.viewCart = async (req, res) => {
  try {
    let cartresponce = []

    if (req.user) {
      console.log('req.user: ', await req.user)
      await cartService.viewCart(req.user).then((usercart) => {
        if (usercart) {
          cartresponce = usercart
        }
      })

      // console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
      // console.log((await req.user._id) + ' eeeeeee')
      // const cart = await cartService.viewCart(req.user._id)
      // console.log(thiscart)
    } else {
      let token = req.cookies['XSRF-TOKEN']
      if (!token) {
        token = req.csrfToken
      }

      const guestCart = await guestCartService.getGuestCart(token)
      if (guestCart) {
        cartresponce = guestCart
      }
    }

    res.status(200).json(cartresponce)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.removeItemFromCart = async (req, res) => {
  try {
    let cartresponce = []
    if (req.user) {
      const cart = await cartService.removeItemFromCart(
        req.user.id,
        req.params.id
      )
      if (cart) {
        cartresponce = cart
      }
    } else {
      let token = req.cookies['XSRF-TOKEN']
      if (!token) {
        token = req.csrfToken
      }

      const guestCart = await guestCartService.removeItemFromGuestCart(
        token,
        req.params.id
      )
      if (guestCart) {
        cartresponce = guestCart
      }
    }

    res.status(200).json(cartresponce)
  } catch (error) {
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
