// src/services/guestCart.service.js

const GuestCart = require('../models/guestCart.model');
const Product = require('../models/product.model');

exports.createGuestCart = async (sessionId) => {
  let guestCart = new GuestCart({ sessionId, items: [] });
  await guestCart.save();
  return guestCart;
};

exports.addItemToGuestCart = async (sessionId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  if (product.inventoryCount < quantity) {
      throw new Error('Not enough inventory for the product');
  }

  product.inventoryCount -= quantity;
  await product.save();

  let guestCart = await GuestCart.findOne({ sessionId });
  if (!guestCart) {
    guestCart = new GuestCart({ sessionId, items: [] });
    await guestCart.save();
  }
  
  const cartItemIndex = guestCart.items.findIndex(item => item.product.toString() === productId);
  if (cartItemIndex > -1) {
    guestCart.items[cartItemIndex].quantity += quantity;
  } else {
    guestCart.items.push({ product, quantity, price: product.price });
  }
  await guestCart.save();
  return guestCart;
};

exports.removeItemFromGuestCart = async (sessionId, itemId) => {
  let guestCart = await GuestCart.findOne({ sessionId });
  if (!guestCart) {
    throw new Error('Cart not found');
  }
  guestCart.items.id(itemId).remove();
  await guestCart.save();
  return guestCart;
};

exports.getGuestCart = async (sessionId) => {
  const guestCart = await GuestCart.findOne({ sessionId }).populate('items.product');
  return guestCart;
};
