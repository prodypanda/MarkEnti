const Cart = require('../models/cart.model')
const CartItem = require('../models/cartItem.model')
const Product = require('../models/product.model')
/**
 * Retrieves the cart for the given user, including populated cart items and products.
 *
 * @param {ObjectId} userId The id of the user to retrieve the cart for
 * @returns {Promise<Cart>} A promise that resolves with the Cart model for the user
 * @throws {Error} If there was an error retrieving the cart
 */
const viewCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items',
      populate: { path: 'product' }
    })
    return cart
  } catch (error) {
    throw new Error(`Error retrieving cart: ${error.message}`)
  }
}

/**
 * Adds a new cart item to the cart for the given user.
 *
 * @param {ObjectId} userId The id of the user to add the cart item for
 * @param {ObjectId} productId The id of the product to add to the cart
 * @param {number} quantity The quantity of the product to add
 * @param {number} price The price paid for the product
 * @returns {Promise<Cart>} A promise that resolves with the updated Cart model for the user
 */
const addItemToCart = async (userId, productId, quantity) => {
  try {
    // const product = await Product.findOne({ _id: productId })
    const product = await Product.findById(productId)
    if (!product) {
      throw {
        message: 'Product not found',
        statusCode: 404
      }
    }
    if (product.inventoryCount < quantity) {
      throw {
        message:
          'Not enough inventory for the product, please reduce quantity or choose a different product.',
        statusCode: 409
      }
    }

    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
      cart = new Cart({ user: userId, items: [] })
    }

    const cartItem = new CartItem({
      product: productId,
      quantity,
      price: product.price
    })

    await cartItem.save()
    cart.items.push(cartItem)
    await cart.save()

    // Update product inventory count to change product count (reserved products)
    product.inventoryCount -= quantity
    await product.save()
    return cart
  } catch (error) {
    throw {
      message: `Error adding item to cart: ${error.message}`,
      statusCode: error.statusCode
    }
  }
}

/**
 * Removes an item from the cart for the given user.
 *
 * @param {ObjectId} userId The id of the user to remove the item from
 * @param {ObjectId} itemId The id of the item to remove
 * @returns {Promise&lt;Cart&gt;} A promise that resolves with the updated cart
 */
const removeItemFromCart = async (userId, itemId) => {
  try {
    const cart = await Cart.findOne({
      user: userId,
      items: { $elemMatch: { $in: itemId } } // Use $elemMatch to check for item within items array
    })
    if (!cart) {
      throw new Error('Cart empty or item not found in cart') // Throw error if cart not found or item not in cart
    }

    // Remove cartItem directly using findById and remove
    const removedCartItem = await CartItem.findByIdAndDelete({ _id: itemId })

    if (!removedCartItem) {
      throw new Error('Item not found in cart')
    }

    // Update cart's items array (optional, depending on your schema)
    cart.items.pull(removedCartItem._id)
    await cart.save()

    return cart
  } catch (error) {
    throw new Error(`Error removing item from cart: ${error.message}`)
  }
}

/**
 * Clears the cart for the authenticated user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const clearCart = async (userId) => {
  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
      // If the cart doesn't exist, return a 404
      throw new Error('Cart not found')
    }

    // Remove all cart items associated with the cart
    await CartItem.deleteMany({ _id: { $in: cart.items } })

    // Clear the items array in the cart document
    cart.items = []
    await cart.save()

    return cart
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error // Re-throw the error to be handled by the controller
  }
}

// Export the service methods

module.exports = {
  viewCart,
  addItemToCart,
  removeItemFromCart,
  clearCart
}
