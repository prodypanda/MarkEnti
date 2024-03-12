const Cart = require('../models/cart.model')
const CartItem = require('../models/cartItem.model')

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
      populate: { path: 'product' },
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
const addItemToCart = async (userId, productId, quantity, price) => {
  try {
    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
      cart = new Cart({ user: userId, items: [] })
    }

    const cartItem = new CartItem({
      product: productId,
      quantity: quantity,
      price: price,
    })

    await cartItem.save()
    cart.items.push(cartItem)
    await cart.save()

    return cart
  } catch (error) {
    throw new Error(`Error adding item to cart: ${error.message}`)
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
    const cart = await Cart.findOne({ user: userId })
    const cartItem = await CartItem.findById(itemId)

    if (!cart || !cartItem) {
      throw new Error('Item not found in cart')
    }

    cart.items.pull(cartItem)
    await cart.save()
    await cartItem.remove()

    return cart
  } catch (error) {
    throw new Error(`Error removing item from cart: ${error.message}`)
  }
}

module.exports = {
  viewCart,
  addItemToCart,
  removeItemFromCart,
}
