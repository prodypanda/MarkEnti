const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


// Define the User schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // role: { type: String, enum: ['root', 'admin', 'manager', 'customer', 'guest'], default: 'customer' },
  role: { type: Schema.Types.ObjectId, ref: 'Role', default: defaultRole },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Verify password
userSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema);
module.exports = User;
