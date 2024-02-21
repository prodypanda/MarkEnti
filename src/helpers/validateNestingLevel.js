const Category = require('../models/category.model')

const maxDepth = 5

async function validateNestingLevel(parentId) {
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

    const parentCategory = await Category.findById(parentId)

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
