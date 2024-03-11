const Order = require('../models/order.model');
const Product = require('../models/product.model');

const calculatePreferences = async (customerId) => {
  try {
    const orders = await Order.find({ customer: customerId }).populate('products.product');
    const categories = new Set();
    orders.forEach(order => {
      order.products.forEach(orderProduct => {
        if (orderProduct.product?.category) {
          categories.add(orderProduct.product.category.toString());
        }
      });
    });

    return Array.from(categories);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  calculatePreferences,
};
