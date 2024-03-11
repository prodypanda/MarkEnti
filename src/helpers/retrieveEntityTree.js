const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')

/**
 * Retrieves a tree of entities by recursively fetching children of each entity based on entity type and parent ID.
 *
 * @param {string} entityType - The type of entity to retrieve (either 'category' or 'menuitem').
 * @param {string} [parentId=null] - The ID of the parent entity to retrieve children for. Omit for top-level entities.
 * @param {Object} filter - Filter conditions to apply to the query.
 * @param {Object} sort - Sort criteria to apply to the query.
 * @param {number} [startIndex=0] - Index of first entity to retrieve.
 * @param {number} [limit=10] - Maximum number of entities to retrieve.
 * @returns {Promise<Object[]>} Promise that resolves to the array of entity objects, with children included.
 */
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
  const retret = await Promise.all(
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
        children,
      }
    })
  )
  return retret
}

/**
 * Returns the Mongoose model class for the given entityType.
 *
 * @param {string} entityType - The entity type ('category' or 'menuitem')
 * @returns {Model} The Mongoose model class for the entity type
 * @throws {Error} If entityType is invalid
 */
function getEntityModel(entityType) {
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
