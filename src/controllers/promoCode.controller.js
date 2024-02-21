const PromoCode = require('../models/promoCode.model')

exports.createPromoCode = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body
    console.log(code)
    let promoCode = new PromoCode({ code, discountPercentage, expirationDate })
    promoCode = await promoCode.save()
    res.status(201).json(promoCode)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// READ - Get all promo codes
exports.getPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find()
    res.json(promoCodes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// READ - Get a single promo code by code
exports.getPromoCodeByCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findOne({ code: req.params.code })
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' })
    }
    res.json(promoCode)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// UPDATE promo code
exports.updatePromoCode = async (req, res) => {
  try {
    const { code } = req.params
    const { discountPercentage, expirationDate } = req.body
    const updatedPromoCode = await PromoCode.findOneAndUpdate(
      { code },
      { discountPercentage, expirationDate },
      { new: true } // Returns the updated document
    )
    if (!updatedPromoCode) {
      return res.status(404).json({ message: 'Promo code not found' })
    }
    res.json(updatedPromoCode)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// DELETE promo code
exports.deletePromoCode = async (req, res) => {
  try {
    const { code } = req.params
    const promoCode = await PromoCode.findOneAndDelete({ code })
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' })
    }
    res.status(200).json({ message: 'Promo code deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// With the code above, I have the full set of CRUD operations for managing promo codes in the system:

// - `createPromoCode` creates a new promo code.
// - `getPromoCodes` retrieves a list of all promo codes.
// - `getPromoCodeByCode` retrieves a single promo code using its unique code.
// - `updatePromoCode` updates an existing promo code.
// - `deletePromoCode` deletes an existing promo code.
