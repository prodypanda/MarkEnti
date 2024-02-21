const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  images: [{ 
    type: String 
  }],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  variations: [
    {
      color: String,
      size: String,
      stock: Number,
      additionalPrice: Number
    }
  ],
  inventoryCount: {
    type: Number,
    required: true,
    min: [0, 'Inventory count cannot be negative.']
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

productSchema.pre('save', function(next){
  this.updated_at = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
