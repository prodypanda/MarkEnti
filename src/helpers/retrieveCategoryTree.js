const Category = require('../models/category.model')

//filter = active
const retrieveCategoryTree = async (
  parentId = null,
  filter = {},
  sort = {},
  startIndex = 0,
  limit = 10
) => {
  // Create a new query object that includes the parentId in the filter
  const query = { ...filter }
  if (parentId !== null) {
    query.parent = parentId
  }

  const categories = await Category.find(query).sort(sort).skip(startIndex).limit(limit);
  return await Promise.all(
    categories.map(async (category) => {
      // Use the correct category._id for the recursive call, and preserve the sort and filter options
      const children = await retrieveCategoryTree(category._id, filter, sort)
      return {
        ...category.toObject(),
        children,
      }
    })
  )
}

module.exports = retrieveCategoryTree
