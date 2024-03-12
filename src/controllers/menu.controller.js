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
const validateNestingLevel = require('../helpers/validateNestingLevel')
const [deleteEntity] = require('../helpers/deleteNodedEntity')
const retrieveEntityTree = require('../helpers/retrieveEntityTree')

exports.createMenu = async (req, res) => {
  try {
    const { title, visible, items } = req.body

    // slugify the string
    let toslogify
    if (req.body.slug || req.body.slug == !null) {
      toslogify = req.body.slug
    } else {
      toslogify = req.body.title
    }
    // slugifying methode: ancrement or random or slugifyMiddleware
    const slug = await slugify(toslogify, 'menu', 'slugifyMiddleware')

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
      updateFields.visible = visible
    }
    if (items !== undefined) {
      if (!Array.isArray(items)) {
        return res.status(400).json({
          message: 'items must be an array of menu items'
        })
      }
      updateFields.items = items
    }
    if (slug !== undefined) {
      updateFields.slug = await slugify(slug, 'category', 'slugifyMiddleware')
    }
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields to update' })
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
    return res.status(200).json(menu)
  } catch (error) {
    return res.status(500).json({ message: error.message })
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
    const menu = await Menu.findByIdAndDelete(id)
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' })
    }
    return res.status(200).json({ message: 'Menu deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
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

exports.getMenusById = async (req, res) => {
  try {
    const { id } = req.params
    const menus = await Menu.find({ _id: id }).populate('items')
    res.status(200).json(menus)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
//
//
//
//
//
//
//
//
/**
 * Creates a new menu item.
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.title - Title of menu item
 * @param {string} req.body.link - Link for menu item
 * @param {number} req.body.orderIndex - Order index of menu item
 * @param {string} req.body.parentItem - ID of parent menu item
 * @param {string} req.body.menu - ID of menu this item belongs to
 * @param {Object} res - Express response object
 * @returns {Promise}
 */
//
//
//
//
//
//
//
//
//
exports.createMenuItem = async (req, res) => {
  const { title, parent } = req.body

  let link
  // slugify the string
  let toslogify
  if (req.body.slug || req.body.slug == !null) {
    toslogify = req.body.slug
  } else {
    toslogify = req.body.title
  }
  // slugifying methode: ancrement or random or slugifyMiddleware
  const slug = await slugify(toslogify, 'menuItem', 'slugifyMiddleware')

  let finallink
  if (req.body.link !== undefined) {
    const linkExists = await MenuItem.findOne({ link: req.body.link })
    if (linkExists) {
      console.log(linkExists)

      return res.status(400).json({
        message:
          'Another menu item with this link already exists, please choose another link'
      })
    } else {
      link = req.body.link
    }
  } else {
    link = slug
  }

  let istoplevel
  if (parent !== undefined) {
    // check if menu exists
    const parentExists = await MenuItem.findById(parent)
    if (!parentExists) {
      return res.status(400).json({
        message: 'Menu Item does not exist'
      })
    } else {
      istoplevel = false
    }
  } else {
    istoplevel = true
  }
  let orderIndex
  if (req.body.orderIndex !== undefined) {
    // check if orderIndex is valid
    if (req.body.orderIndex < 0) {
      return res.status(400).json({
        message: 'Order index must be a zero or a positive integer'
      })
    } else {
      orderIndex = req.body.orderIndex
    }
  } else {
    orderIndex = 0
  }

  let orderIndexExists = true
  let i = orderIndex
  while (orderIndexExists) {
    orderIndexExists = await MenuItem.findOne({
      orderIndex: i
    })
    if (!orderIndexExists) {
      orderIndex = i
      break
    }
    i++
  }

  const createdBy = req.user._id
  try {
    const menuItem = new MenuItem({
      title,
      slug,
      link,
      orderIndex,
      parent,
      istoplevel,
      createdBy
    })

    await menuItem.validate()
    const savedMenuItem = await menuItem.save()
    return res.status(201).json(savedMenuItem)
  } catch (error) {
    if (error.code === 11000) {
      // Determine which field caused the duplicate key error
      const field = Object.keys(error.keyValue || {})[0]
      let errorMessage = 'Duplicate field error'
      if (field === 'title') {
        errorMessage = `Category title "${title}" already exists, please choose another title.`
      } else if (field === 'slug') {
        errorMessage = `Slug "${slug}" already exists, please choose another slug.`
      } else if (field === 'link') {
        errorMessage = `link "${link}" already exists, please choose another link.`
      } else {
        errorMessage = `${field} already exists, please choose another one. ${error}`
      }

      return res.status(400).json({
        success: false,
        message: errorMessage
      })
    } else {
      // Handle other errors
      return res.status(400).json({
        success: false,
        message:
          error.message || 'An error occurred while creating the category.'
      })
    }
  }
}
//
//
//
//
//
//
//
//
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params
  const { title, slug, link, parent } = req.body

  const updateFields = {}
  if (title || title == !null) updateFields.title = title // INPUT_REQUIRED {Handle any additional fields here}
  if (slug || slug == !null) {
    updateFields.slug = await slugify(slug, 'menuItem', 'slugifyMiddleware')
  }

  if (link || link == !null) updateFields.link = link // INPUT_REQUIRED {Handle any additional fields here}

  let orderIndex
  if (req.body.orderIndex !== undefined) {
    // check if orderIndex is valid
    if (req.body.orderIndex < 0) {
      return res.status(400).json({
        message: 'Order index must be a zero or a positive integer'
      })
    } else {
      orderIndex = req.body.orderIndex

      let orderIndexExists = true
      let i = orderIndex
      while (orderIndexExists) {
        orderIndexExists = await MenuItem.findOne({
          orderIndex: i
          // _id: { $ne: req.params.id },
        })
        if (!orderIndexExists || orderIndexExists.id == req.params.id) {
          orderIndex = i
          break
        }
        i++
      }

      updateFields.orderIndex = orderIndex
    }
  }

  if (parent || parent == !null) {
    // check if parentItem exists
    const parentItemExists = await MenuItem.findById(parent)
    // if (parentItemExists && parentItemExists.parent) {
    //   return res.status(400).json({
    //     message: 'Parent item must be a top level item',
    //   })
    // }
    if (!parentItemExists) {
      return res.status(404).json({
        message: 'Parent item does not exist'
      })
    }
    updateFields.parent = parent
  }

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: 'No fields to update' })
  } else {
    updateFields.updatedBy = req.user._id
  }

  try {
    if (updateFields.parent || updateFields.parent == !null) {
      await validateNestingLevel(updateFields.parent, 'menuItem')
    }

    // const menuItem = await MenuItem.findByIdAndUpdate(
    //   id,
    //   { $set: updateFields },
    //   { new: true }
    // )
    // if (!menuItem) {
    //   return res.status(404).json({ message: 'Menu item not found' })
    // }
    // res.status(200).json(menuItem)

    const menuItem = await MenuItem.findById(id)
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu Item not found' })
    } else {
      menuItem.set(updateFields)
      await menuItem.validate()
    }
    const savedMenuItem = await menuItem.save()
    return res.status(201).json(savedMenuItem)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params

    const WithDescendants = req.query.withDescendants === 'true' // Check query parameter for delete with descendants or with references only
    const returnMsg = await deleteEntity(id, 'menuitem', WithDescendants)
    return res.status(200).json({ message: returnMsg })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

exports.getMenuItems = async (req, res) => {
  try {
    const { start, end } = req.query // Extract start and end from query parameters

    // Convert start and end to numbers and calculate limit
    const startIndex = parseInt(start, 10) || 0 // Default to 0 if not provided
    const endIndex = parseInt(end, 10) || 0 // Default to 0 if not provided
    const limit = endIndex ? endIndex - startIndex + 1 : undefined // Calculate limit based on end and start

    // Count the total number of menu items
    const totalCount = await MenuItem.countDocuments({}) // You can add any specific filters if necessary

    const menuitemsTree = await retrieveEntityTree(
      'menuitem',
      null,
      req.filter,
      req.sort,
      startIndex,
      limit
    )

    // Set the x-total-count header with the total count
    res.setHeader('x-total-count', totalCount.toString())
    res.status(200).json(menuitemsTree)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * Retrieves a specific menu item by its ID and returns its ancestors and the menu item itself.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
exports.getMenuItemsById = async (req, res) => {
  try {
    const { id } = req.params

    // Find the menu item with the specified ID
    const menuItem = await MenuItem.findById(id).lean()

    if (!menuItem) {
      // If the menu item is not found, return a 404 response with an error message
      return res.status(404).json({ message: 'Menu Item not found' })
    }

    // Find the ancestors of the menu item
    const ancestors = await MenuItem.find({
      _id: { $in: menuItem.ancestors }
    }).lean()

    // Return a 200 response with the ancestors and the menu item
    res.status(200).json({
      ancestors: ancestors.map((ancestor) => ({
        _id: ancestor._id,
        title: ancestor.title,
        parent: ancestor.parent,
        ancestors: ancestor.ancestors
      })),
      menuItem
    })
  } catch (error) {
    // Return a 400 response with the error message
    return res.status(400).json({ message: error.message })
  }
}

/**
 * Reorders menu items in a web application.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with a success message or an error message.
 */
exports.reorderMenuItems = async (req, res) => {
  try {
    const { menuId, orderedItems } = req.body // Destructure body for clarity

    // Input validation:
    if (!menuId || !orderedItems || !Array.isArray(orderedItems)) {
      return res.status(400).json({ message: 'Invalid menuId or orderedItems' })
    }

    // Ensure all itemIds exist in the database to prevent orphaned references
    const existingItemIds = await MenuItem.find({
      _id: { $in: orderedItems },
      menu: menuId
    }).distinct('_id')

    if (existingItemIds.length !== orderedItems.length) {
      return res
        .status(400)
        .json({ message: 'One or more itemIds are invalid' })
    }

    // Create update operations with better efficiency:
    const updateOperations = orderedItems.map((itemId, index) => ({
      updateOne: {
        filter: { _id: itemId, menu: menuId },
        update: { $set: { orderIndex: index } } // Use $set for focused updates
      }
    }))

    // Bulk write:
    await MenuItem.bulkWrite(updateOperations)

    return res
      .status(200)
      .json({ message: 'Menu items reordered successfully' })
  } catch (error) {
    console.error(error) // Log the error for debugging
    return res
      .status(500)
      .json({ message: 'An error occurred while reordering menu items' })
  }
}
