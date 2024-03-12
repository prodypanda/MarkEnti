// src/services/guestCart.service.js

const GuestCart = require('../models/guestCart.model')
const Product = require('../models/product.model')

/**
 * Creates a new guest cart with the provided session ID and an empty items array.
 * Saves the new guest cart to the database.
 * Returns the new guest cart.
 */
exports.createGuestCart = async (sessionId) => {
  let guestCart = new GuestCart({ sessionId, items: [] })
  await guestCart.save()
  return guestCart
}

/**
 * Adds an item to the guest cart with the provided session ID.
 * Finds the product by ID, validates inventory is available,
 * updates inventory count, finds or creates the guest cart,
 * adds/updates the item in the cart items array,
 * saves the updated guest cart, and returns it.
 */
exports.addItemToGuestCart = async (sessionId, productId, quantity) => {
  const product = await Product.findById(productId)
  if (!product) {
    throw new Error('Product not found')
  }

  if (product.inventoryCount < quantity) {
    throw new Error('Not enough inventory for the product')
  }

  product.inventoryCount -= quantity
  await product.save()

  let guestCart = await GuestCart.findOne({ sessionId })
  if (!guestCart) {
    guestCart = new GuestCart({ sessionId, items: [] })
    await guestCart.save()
  }

  const cartItemIndex = guestCart.items.findIndex(
    (item) => item.product.toString() === productId
  )
  if (cartItemIndex > -1) {
    guestCart.items[cartItemIndex].quantity += quantity
  } else {
    guestCart.items.push({ product, quantity, price: product.price })
  }
  await guestCart.save()
  return guestCart
}

/**
 * Removes an item from the guest cart with the provided session ID and item ID.
 * Finds the guest cart by session ID, validates it exists,
 * removes the item by ID from the cart items array,
 * saves the updated guest cart, and returns it.
 */
exports.removeItemFromGuestCart = async (sessionId, itemId) => {
  let guestCart = await GuestCart.findOne({ sessionId })
  if (!guestCart) {
    throw new Error('Cart not found')
  }
  guestCart.items.id(itemId).remove()
  await guestCart.save()
  return guestCart
}

/**
 * Gets the guest cart for the provided session ID.
 * Finds the guest cart by session ID and populates the product references in the items array.
 * Returns the found guest cart.
 */
exports.getGuestCart = async (sessionId) => {
  const guestCart = await GuestCart.findOne({ sessionId }).populate(
    'items.product'
  )
  return guestCart
}
