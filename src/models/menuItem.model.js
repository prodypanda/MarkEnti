const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  orderIndex: {
    type: Number,
    required: true,
    default: 0
  },
  parentItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    default: null
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  }
}, {
  timestamps: true
});

menuItemSchema.index({ menu: 1, orderIndex: 1 }, { unique: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;
