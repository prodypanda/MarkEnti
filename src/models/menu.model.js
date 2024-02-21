const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }]
}, {
  timestamps: true
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
