const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')

const maxDepth = 5

/**
 * Validates that a category or menu item does not exceed the maximum nesting depth.
 *
 * @param {string} parentId - The ID of the parent category
 * @param {string} elementType - Either 'category' or 'menuItem'
 * @returns {Promise<boolean>} Promise that resolves to true if nesting depth is valid
 * @throws {Error} If the parent category is not found or the nesting depth exceeds the max
 */
async function validateNestingLevel(parentId, elementType) {
  let Element
  if (elementType === 'category') {
    Element = Category
  } else if (elementType === 'menuItem') {
    Element = MenuItem
  } else {
    throw new Error(`Invalid element type: ${elementType}`)
  }

  // Check if the parent category exists

  if (!parentId) {
    // This is a top-level category since there's no parent.
    return true
  }

  let depth = 0

  while (parentId) {
    // Additional null check
    if (!parentId) {
      break
    }

    const parentCategory = await Element.findById(parentId)

    // Check if the parent category was found
    if (!parentCategory) {
      throw new Error(`Parent category with ID ${parentId} not found`)
    }

    depth++
    parentId = parentCategory.parent

    if (depth >= maxDepth) {
      throw new Error(`Exceeded max nesting level of ${maxDepth}.`)
    }
  }

  return true
}

module.exports = validateNestingLevel
