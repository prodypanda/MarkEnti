const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');

const viewCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items',
      populate: { path: 'product' }
    });
    return cart;
  } catch (error) {
    throw new Error('Error retrieving cart: ' + error.message);
  }
};

const addItemToCart = async (userId, productId, quantity, price) => {
  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const cartItem = new CartItem({
      product: productId,
      quantity: quantity,
      price: price
    });

    await cartItem.save();
    cart.items.push(cartItem);
    await cart.save();

    return cart;
  } catch (error) {
    throw new Error('Error adding item to cart: ' + error.message);
  }
};

const removeItemFromCart = async (userId, itemId) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    const cartItem = await CartItem.findById(itemId);

    if (!cart || !cartItem) {
      throw new Error('Item not found in cart');
    }

    cart.items.pull(cartItem);
    await cart.save();
    await cartItem.remove();

    return cart;
  } catch (error) {
    throw new Error('Error removing item from cart: ' + error.message);
  }
};

module.exports = {
  viewCart,
  addItemToCart,
  removeItemFromCart
};