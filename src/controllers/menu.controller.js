/**
 * Menu controller handles CRUD operations for menus and menu items.
 *
 * Exports functions for:
 * - Creating, updating, deleting and getting menus
 * - Creating, updating, deleting and getting menu items
 * - Reordering menu items
 */
const Menu = require('../models/menu.model')
const MenuItem = require('../models/menuItem.model')

/**
 * Creates a new menu.
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.title - Menu title
 * @param {string} req.body.slug - Menu slug
 * @param {boolean} req.body.visible - Whether menu is visible
 * @param {Object[]} req.body.items - Array of menu items
 * @param {Object} res - Express response object
 * @returns {Promise}
 */
exports.createMenu = async (req, res) => {
  try {
    const { title, slug, visible, items } = req.body
    const menu = new Menu({ title, slug, visible, items })
    await menu.save()
    res.status(201).json(menu)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * Updates an existing menu.
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.id - ID of menu to update
 * @param {string} req.body.title - Updated menu title
 * @param {string} req.body.slug - Updated menu slug
 * @param {boolean} req.body.visible - Updated visibility status
 * @param {Object[]} req.body.items - Updated array of menu items
 * @param {Object} res - Express response object
 * @returns {Promise}
 */
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params
    const { title, slug, visible, items } = req.body
    const menu = await Menu.findByIdAndUpdate(
      id,
      { title, slug, visible, items },
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

/**
 * Deletes a menu by ID.
 *
 * @param {Object} req - Express request object
 * @param {string} req.params.id - ID of menu to delete
 * @param {Object} res - Express response object
 * @returns {Promise}
 */
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params
    await Menu.findByIdAndDelete(id)
    res.status(200).json({ message: 'Menu deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * Gets all menus populated with their menu items.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise} Promise that resolves to array of menus
 */
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
