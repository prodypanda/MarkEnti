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
const slugify = require('../utils/stringUtils')


exports.createMenu = async (req, res) => {
  try {
    const { title, visible, items } = req.body
  
    //slugify the string
    let toslogify
    if(req.body.slug || req.body.slug == !null){
      toslogify = req.body.slug
    }else{
      toslogify = req.body.title
    }
    // slugifying methode: ancrement or random or slugifyMiddleware    
  const slug = await slugify(toslogify, 'menu', 'slugifyMiddleware')
  console.log("slug: "+slug)

    const menu = new Menu({ title, slug, visible, items })
    await menu.save()
    res.status(201).json(menu)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params
    const { title, visible, slug, items } = req.body

    const updateFields = {}
    if (title !== undefined) {
      updateFields.title = title
    }
    if (visible !== undefined) { 
      updateFields.visible = visible;
    }
    if (items !== undefined) {
      if (!Array.isArray(items)) {
        return res
          .status(400)
          .json({ message: 'items must be an array of menu items' })
      }
      updateFields.items = items
    }
    if (slug !== undefined) {
      updateFields.slug = await slugify(slug, 'category', 'slugifyMiddleware')
    }
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: 'No fields to update' })
    }

    // Update the menu with the new fields
    const menu = await Menu.findByIdAndUpdate(
      id,
      { $set: updateFields },
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
    //slugify the string
    let toslogify
    if(req.body.slug || req.body.slug == !null){
      toslogify = req.body.slug
    }else{
      toslogify = req.body.title
    }
    // slugifying methode: ancrement or random or slugifyMiddleware    
    const slug = await slugify(toslogify, 'menu', 'slugifyMiddleware')
  
    //check if menu exists
    const menuExists = await Menu.findById(menu)
    if (!menuExists) {
      return res.status(400).json({ message: 'Menu does not exist' })
    }
    //check if parentItem exists
    const parentItemExists = await MenuItem.findById(parentItem)
   if (parentItemExists && parentItemExists.parentItem) {
      return res.status(400).json({ message: 'Parent item must be a top level item' })
    }
    //check if orderIndex is valid
    if (orderIndex < 0) {
      return res.status(400).json({ message: 'Order index must be a zero or a positive integer' })
    } else {
      orderIndex = 0
    }
    
    const menuItem = new MenuItem({ title, slug, link, orderIndex, parentItem, menu })
    await menuItem.save()
    res.status(201).json(menuItem)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}








exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params
    const { title, slug, link, orderIndex, parentItem, menu } = req.body


    const updateFields = {}
    if (title !== undefined) {
      updateFields.title = title
    }
    if (link !== undefined) { 
      updateFields.link = link;
    }
    if (orderIndex !== undefined) { 
      //check if orderIndex is valid
      if (orderIndex < 0) {
        return res.status(400).json({ message: 'Order index must be a zero or a positive integer' })
      }
    updateFields.orderIndex = orderIndex;
    }
    if (parentItem !== undefined) {
    //check if parentItem exists
    const parentItemExists = await MenuItem.findById(parentItem)
      if (parentItemExists && parentItemExists.parentItem) {
          return res.status(400).json({ message: 'Parent item must be a top level item' })
      }
      updateFields.parentItem = parentItem
    }
    if (menu !== undefined) {
      //check if menu exists
      const menuExists = await Menu.findById(menu)
      if (!menuExists) {
        return res.status(400).json({ message: 'Menu does not exist' })
      }
      updateFields.menu = menuExists._id
    }
 
    if (slug !== undefined) {
      updateFields.slug = await slugify(slug, 'category', 'slugifyMiddleware')
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields to update' })
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    )
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' })
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
