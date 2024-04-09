// src/controllers/guestCart.controller.js

const guestCartService = require('../services/guestCart.service.js')

exports.createGuestCart = async (req, res) => {
  try {
    let token = req.cookies['XSRF-TOKEN']
    if (!token) {
      token = req.csrfToken
    }

    const guestCart = await guestCartService.createGuestCart(token)
    if (guestCart) {
      return res.status(201).json(guestCart)
    } else {
      return res.status(500).json({ message: 'Error creating guest cart' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.addItemToGuestCart = async (req, res) => {
  try {
    let token = req.cookies['XSRF-TOKEN']
    if (!token) {
      token = req.csrfToken
    }

    const updatedGuestCart = await guestCartService.addItemToGuestCart(
      token,
      req.body.productId,
      req.body.quantity
    )
    return res.status(201).json(updatedGuestCart)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getGuestCart = async (req, res) => {
  try {
    let token = req.cookies['XSRF-TOKEN']
    if (!token) {
      token = req.csrfToken
    }

    const guestCart = await guestCartService.getGuestCart(token)
    return res.status(200).json(guestCart)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.updateAllItemsInGuestCart = async (req, res) => {
  try {
    let token = req.cookies['XSRF-TOKEN']
    if (!token) {
      token = req.csrfToken
    }
    const updatedGuestCart = await guestCartService.updateAllItemsInGuestCart(
      token,
      req.body.items
        .map((item) => {
          return {
            productId: item.productId,
            quantity: item.quantity,
          }
        })
        .filter((item) => item.quantity !== 0)
        .map((item) => {
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          }
        })
        .filter((item) => item.price !== 0)
      //.map(item => {
      // return {
      // productId: item.productId,
      // quantity: item.quantity,
      // price: item.price,
      // }
      // })
    )
    return res.status(200).json(updatedGuestCart)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.updateItemInGuestCart = async (req, res) => {
  try {
    let token = req.cookies['XSRF-TOKEN']
    if (!token) {
      token = req.csrfToken
    }
    const updatedGuestCart = await guestCartService.updateItemInGuestCart(
      token,
      req.params.itemId,
      req.body.quantity
    )
    return res.status(200).json(updatedGuestCart)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.removeItemFromGuestCart = async (req, res) => {
  try {
    let token = req.cookies['XSRF-TOKEN']
    if (!token) {
      token = req.csrfToken
    }

    const updatedGuestCart = await guestCartService.removeItemFromGuestCart(
      token,
      req.params.itemId
    )
    return res.status(200).json(updatedGuestCart)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.deleteGuestCart = async (req, res) => {
  try {
    let token = req.cookies['XSRF-TOKEN']
    if (!token) {
      token = req.csrfToken
    }

    const updatedGuestCart = await guestCartService.deleteGuestCart(token)
    return res.status(200).json(updatedGuestCart)
    // return res.status(200).json({ message: 'Cart cleared successfully' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
