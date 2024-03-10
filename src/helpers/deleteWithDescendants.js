const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')

/**
 * Delete an entity by ID and handle descendants and references.
 *
 * @param {string} entityId - The ID of the entity to delete
 * @param {string} entityType - 'category' or 'menuitem'
 * @param {boolean} deleteDescendants - Whether to delete descendants
 * @returns {Promise<string>} Status message
 */
const deleteEntity = async (entityId, entityType, deleteDescendants = true) => {
  try {
    if (deleteDescendants) {
      await deleteWithDescendants(entityId, entityType)
    } else {
      const returnAndCleanReferences = await deleteAndCleanReferences(
        entityId,
        entityType
      )
      return returnAndCleanReferences
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * Delete an entity and all its descendants recursively.
 *
 * @param {string} entityId
 * @param {string} entityType
 */
const deleteWithDescendants = async (entityId, entityType) => {
  const EntityModel = getEntityModel(entityType)

  const descendantIds = await EntityModel.find({ parent: entityId }).distinct(
    '_id'
  )

  for (const descendantId of descendantIds) {
    await deleteWithDescendants(descendantId, entityType)
  }

  await EntityModel.findByIdAndDelete(entityId)

  return `${entityType} and its descendants have been removed`
}

/**
 * Get the Mongoose model for the given entity type.
 *
 * @param {string} entityType
 * @returns {Model}
 */
function getEntityModel(entityType) {
  if (entityType === 'menuitem') {
    return MenuItem
  } else if (entityType === 'category') {
    return Category
  } else {
    return Category
  }
}

/**
 * Delete an entity and clean up references.
 *
 * @param {string} entityId
 * @param {string} entityType
 * @returns {Promise<string>}
 */
const deleteAndCleanReferences = async (entityId, entityType) => {
  const EntityModel = getEntityModel(entityType)

  await EntityModel.findByIdAndDelete(entityId)

  await EntityModel.updateMany(
    { parent: entityId },
    {
      parent: null,
      isTopLevel: true,
      $pull: { ancestors: entityId },
    }
  )

  await EntityModel.updateMany(
    { ancestors: entityId },
    { $pull: { ancestors: entityId } }
  )

  return `${entityType} and its references have been removed`
}

module.exports = [deleteEntity, deleteWithDescendants]
