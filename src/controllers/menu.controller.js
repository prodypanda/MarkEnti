const Menu = require('../models/menu.model')
const MenuItem = require('../models/menuItem.model')

exports.createMenu = async (req, res) => {
  try {
    const { title, slug } = req.body
    const menu = new Menu({ title, slug })
    await menu.save()
    res.status(201).json(menu)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params
    const { title, slug } = req.body
    const menu = await Menu.findByIdAndUpdate(
      id,
      { title, slug },
      { new: true }
    )
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' })
    }
    res.status(200).json(menu)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params
    await Menu.findByIdAndDelete(id)
    res.status(200).json({ message: 'Menu deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.find().populate('items')
    res.status(200).json(menus)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createMenuItem = async (req, res) => {
  try {
    const { title, link, orderIndex, parentItem, menu } = req.body
    const menuItem = new MenuItem({ title, link, orderIndex, parentItem, menu })
    await menuItem.save()
    res.status(201).json(menuItem)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params
    const { title, link, orderIndex, parentItem } = req.body
    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      { title, link, orderIndex, parentItem },
      { new: true }
    )
    if (!menuItem) {
      return res.status(404).json({ message: 'MenuItem not found' })
    }
    res.status(200).json(menuItem)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params
    await MenuItem.findByIdAndDelete(id)
    res.status(200).json({ message: 'MenuItem deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMenuItems = async (req, res) => {
  try {
    const { menuId } = req.params
    const menu = await Menu.findById(menuId).populate('items')
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' })
    }
    res.status(200).json(menu.items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.reorderMenuItems = async (req, res) => {
  try {
    const { menuId, orderedItems } = req.body
    orderedItems.forEach(async (itemId, index) => {
      await MenuItem.updateOne(
        { _id: itemId, menu: menuId },
        { orderIndex: index }
      )
    })
    res.status(200).json({ message: 'Menu Items reordered successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
