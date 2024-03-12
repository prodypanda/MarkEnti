const Page = require('../models/page.model')

exports.createPage = async (req, res) => {
  try {
    const { title, content, slug } = req.body
    const page = new Page({ title, content, slug })
    await page.save()
    res.status(201).json(page)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, published } = req.body
    const page = await Page.findByIdAndUpdate(
      id,
      { title, content, published },
      { new: true }
    )
    if (!page) {
      return res.status(404).json({ message: 'Page not found' })
    }
    return res.status(200).json(page)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params
    const page = await Page.findByIdAndRemove(id)
    if (!page) {
      return res.status(404).json({ message: 'Page not found' })
    }
    return res.status(200).json({ message: 'Page deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getPage = async (req, res) => {
  try {
    const { id } = req.params
    const page = await Page.findById(id)
    if (!page) {
      return res.status(404).json({ message: 'Page not found' })
    }
    return res.status(200).json(page)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getPages = async (req, res) => {
  try {
    const pages = await Page.find()
    return res.status(200).json(pages)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
