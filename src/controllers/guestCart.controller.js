// src/controllers/guestCart.controller.js

const guestCartService = require('../services/guestCart.service.js')

exports.createGuestCart = async (req, res) => {
  try {
    const guestCart = await guestCartService.createGuestCart(
      req.cookies.guestSessionId
    )
    return res.status(201).json(guestCart)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.addItemToGuestCart = async (req, res) => {
  try {
    const updatedGuestCart = await guestCartService.addItemToGuestCart(
      req.cookies.guestSessionId,
      req.body.productId,
      req.body.quantity
    )
    return res.status(201).json(updatedGuestCart)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.removeItemFromGuestCart = async (req, res) => {
  try {
    const updatedGuestCart = await guestCartService.removeItemFromGuestCart(
      req.cookies.guestSessionId,
      req.params.itemId
    )
    return res.status(200).json(updatedGuestCart)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getGuestCart = async (req, res) => {
  try {
    const guestCart = await guestCartService.getGuestCart(
      req.cookies.guestSessionId
    )
    return res.status(200).json(guestCart)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
