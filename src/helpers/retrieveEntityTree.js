const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')

// entityType = category
// parentId = null
// sort = { name: 1 }

// filter = active
const retrieveEntityTree = async (
  entityType,
  parentId = null,
  filter = {},
  sort = {},
  startIndex = 0,
  limit = 10
) => {
  // Validate the entityType value
  if (!['category', 'menuitem'].includes(entityType)) {
    throw new Error('Invalid entityType value')
  }
  const EntityModel = getEntityModel(entityType)
  // Create a new query object that includes the parentId in the filter
  const query = { ...filter }
  if (parentId !== null) {
    query.parent = parentId
  }

  const entities = await EntityModel.find(query)
    .sort(sort)
    .skip(startIndex)
    .limit(limit)
  return await Promise.all(
    entities.map(async (entity) => {
      // Use the correct entity._id for the recursive call, and preserve the sort and filter options
      const children = await retrieveEntityTree(
        entityType,
        entity._id,
        filter,
        sort
      )
      return {
        ...entity.toObject(),
        children
      }
    })
  )
}

function getEntityModel (entityType) {
  switch (entityType) {
    case 'menuitem':
      return MenuItem
    case 'category':
      return Category
    default:
      throw new Error('Invalid entityType value')
  }
}

module.exports = retrieveEntityTree
