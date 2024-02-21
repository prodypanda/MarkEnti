const ShippingConfig = require('../models/shippingConfig.model')

exports.getShippingOptions = async (req, res) => {
  try {
    const options = await ShippingConfig.find()
    res.status(200).json(options)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateShippingOption = async (req, res) => {
  try {
    const { id } = req.params
    const { type, cost } = req.body
    let option = await ShippingConfig.findByIdAndUpdate(
      id,
      { type, cost },
      { new: true }
    )
    res.status(200).json(option)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.createShippingOption = async (req, res) => {
  try {
    const { type, cost } = req.body
    let newOption = new ShippingConfig({ type, cost })
    newOption = await newOption.save()
    res.status(201).json(newOption)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteShippingOption = async (req, res) => {
  try {
    const { id } = req.params
    await ShippingConfig.findByIdAndDelete(id)
    res.status(200).json({ message: 'Shipping option deleted' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
