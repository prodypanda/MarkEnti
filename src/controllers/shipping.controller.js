const ShippingConfig = require('../models/shippingConfig.model')

exports.getShippingOptions = async (req, res) => {
  try {
    const options = await ShippingConfig.find()
    return res.status(200).json(options)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.updateShippingOption = async (req, res) => {
  try {
    const { id } = req.params
    const { type, cost } = req.body
    const option = await ShippingConfig.findByIdAndUpdate(
      id,
      { type, cost },
      { new: true }
    )
    return res.status(200).json(option)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

exports.createShippingOption = async (req, res) => {
  try {
    const { type, cost } = req.body
    let newOption = new ShippingConfig({ type, cost })
    newOption = await newOption.save()
    return res.status(201).json(newOption)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

exports.deleteShippingOption = async (req, res) => {
  try {
    const { id } = req.params
    await ShippingConfig.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Shipping option deleted' })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}
