// src/services/guestCart.service.js

const GuestCart = require('../models/guestCart.model')
const Product = require('../models/product.model')

/**
 * Creates a new guest cart with the provided session ID and an empty items array.
 * Saves the new guest cart to the database.
 * Returns the new guest cart.
 */
exports.createGuestCart = async (sessionId) => {
  if (!sessionId) {
    throw new Error('Session ID is required')
  }

  let guestCart = await GuestCart.findOne({ sessionId }) // Check if cart exists
  if (!guestCart) {
    // Create new cart if not found
    guestCart = new GuestCart({ sessionId, items: [] }) // Create new cart model instance

    await guestCart.save()
  }
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
  if (!productId || !quantity) {
    throw new Error('Product ID and quantity are required')
  } else if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0')
  }

  // Find product by ID and validate inventory count
  const product = await Product.findById(productId)
  if (!product) {
    throw new Error('Product not found')
  }

  if (product.inventoryCount < quantity) {
    throw new Error(
      'Not enough inventory for the product, please reduce quantity or choose a different product.'
    )
  }

  let guestCart = await GuestCart.findOne({ sessionId })
  if (!guestCart) {
    // guestCart = new GuestCart({ sessionId, items: [] })
    // await guestCart.save()
    guestCart = await this.createGuestCart(sessionId) // Create if not found
  }

  // Add/update item in cart items array
  // Check if item already exists in cart items array by product ID
  // If item exists, update quantity, else add new item to array
  // Save updated cart
  // Return updated cart
  const cartItemIndex = guestCart.items.findIndex(
    (item) => item.product.toString() === productId
  )
  if (cartItemIndex > -1) {
    guestCart.items[cartItemIndex].quantity += quantity
  } else {
    guestCart.items.push({ product, quantity, price: product.price })
  }
  await guestCart.save()

  product.inventoryCount -= quantity
  await product.save()

  return guestCart
}

/**
 * Gets the guest cart for the provided session ID.
 * Finds the guest cart by session ID and populates the product references in the items array.
 * Returns the found guest cart.
 */
exports.getGuestCart = async (sessionId) => {
  if (!sessionId) {
    throw new Error('Session ID is required')
  }

  // Find guest cart by session ID and populate product references in items array
  // Return found guest cart
  let guestCart = await GuestCart.findOne({ sessionId }).populate(
    'items.product'
  )
  if (!guestCart) {
    // Create new guest cart if not found
    guestCart = new GuestCart({ sessionId, items: [] }) // Create new cart model instance

    await guestCart.save()

    // throw new Error('Cart not found, please refresh the page and try again')
    return { guestCart }
  } else if (guestCart.items.length === 0) {
    return { guestCart }
  } else {
    return guestCart
  }
}

exports.updateAllItemsInGuestCart = async (sessionId, items) => {
  if (!sessionId) {
    throw new Error('Session ID is required')
  } else if (!items || items.length === 0) {
    // throw new Error('Items array is required and cannot be empty')
    items = []
  }
  let guestCart = await GuestCart.findOne({ sessionId })
  if (!guestCart) {
    throw new Error('Cart not found, please refresh the page and try again')
  }
  guestCart.items = items
  await guestCart.save()
  return guestCart
}

exports.updateItemInGuestCart = async (sessionId, itemId, quantity) => {
  if (!sessionId) {
    throw new Error('Session ID is required')
  } else if (!itemId) {
    throw new Error('Item ID is required')
  } else if (!quantity) {
    throw new Error('Quantity is required')
  } else if (quantity <= 0) {
    return await this.removeItemFromGuestCart(sessionId, itemId)
  }
  let guestCart = await GuestCart.findOne({ sessionId })
  if (!guestCart) {
    throw new Error('Cart not found, please refresh the page and try again')
  }
  const cartItemIndex = guestCart.items.findIndex(
    (item) => item.product.toString() === itemId
  )
  if (cartItemIndex > -1) {
    guestCart.items[cartItemIndex].quantity = quantity
    await guestCart.save()
    return guestCart
  } else {
    throw new Error('Item not found')
  }
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
    throw new Error('Cart not found, please refresh the page and try again')
  }
  if (!itemId) {
    guestCart.items = []
  } else {
    const cartItemIndex = guestCart.items.findIndex(
      (item) => item.product.toString() === itemId
    )
    if (cartItemIndex > -1) {
      guestCart.items.splice(cartItemIndex, 1)
    }
  }
  // guestCart.items.id(itemId).remove()
  await guestCart.save()
  return guestCart
}
// add functionality to change product count (return reserved products) for each deleted product in guest cart
exports.clearGuestCart = async (sessionId) => {
  if (!sessionId) {
    throw new Error('Session ID is required')
  }
  const guestCart = await GuestCart.findOne({ sessionId })
  if (!guestCart) {
    throw new Error('Cart not found, please refresh the page and try again')
  }

  // Iterate over each item in the guest cart
  for (const item of guestCart.items) {
    const product = await Product.findById(item.product)
    if (product) {
      // Update the product's inventory count by adding back the quantity from the cart
      product.inventoryCount += item.quantity
      await product.save()
    }
  }

  // Clear the items array after updating inventory counts
  guestCart.items = []
  await guestCart.save()
  return true
}

exports.deleteGuestCart = async (sessionId) => {
  if (!sessionId) {
    throw new Error('Session ID is required')
  }
  const guestCart = await GuestCart.findOne({ sessionId })
  if (!guestCart) {
    throw new Error('Cart not found, please refresh the page and try again')
  }
  await guestCart.deleteOne({ sessionId })
  return true
}
