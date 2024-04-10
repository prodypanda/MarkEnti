const cartService = require('../services/cart.service')
const guestCartService = require('../services/guestCart.service.js')

exports.addItemToCart = async (req, res) => {
  // check if user authenticated or not
  // if true:
  // -run the addItemToCart service:
  // --check if product exist, if false: throw an error
  // --check if enough inventory for the product, if false: throw an error
  // --check if cart exist, if false: create a new empty cart
  // --add new CartItem and fill it with product informations
  // --save cart and CartItem
  // --Update product inventory count by changing product count (reserved products)
  // if false:
  // -check if req.cookies exist, if false: generate a new one req.csrfToken()
  // -run the addItemToGuestCart service:
  // --check if product exist, if false: throw an error
  // --check if enough inventory for the product, if false: throw an error
  // --check if guestcart exist, if false: create a new empty guestcart
  // --add new GuestCartItem and fill it with product informations
  // --save guestcart and GuestCartItem
  // --Update product inventory count by changing product count (reserved products)

  try {
    let cartResponse = []
    const { productId, quantity } = req.body

    if (req.user) {
      const updatedCart = await cartService.addItemToCart(
        req.user._id,
        productId,
        quantity
      )
      if (updatedCart) {
        cartResponse = updatedCart
      }
    } else {
      let token = req.cookies['XSRF-TOKEN']
      if (!token) {
        token = req.csrfToken()
      }
      const updatedGuestCart = await guestCartService.addItemToGuestCart(
        token,
        productId,
        quantity
      )
      if (updatedGuestCart) {
        cartResponse = updatedGuestCart
      }
    }

    return res.status(201).json(cartResponse)
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message })
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
