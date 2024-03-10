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
  if (!['category', 'menuitem'].includes(entityType)) {
    throw new Error('Invalid entityType value')
  }

  if (deleteDescendants) {
    const returnMsg = await deleteEntityAndDescendants(entityId, entityType)
    return returnMsg
  } else {
    const returnMsg = await deleteEntityAndCleanReferences(entityId, entityType)
    return returnMsg
  }
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
    throw new Error('Invalid entityType value')
  }
}

/**
 * Delete an entity and all its descendants recursively.
 *
 * @param {string} entityId
 * @param {string} entityType
 */
const deleteEntityAndDescendants = async (entityId, entityType) => {
  const EntityModel = getEntityModel(entityType)

  const descendantIds = await EntityModel.find({ parent: entityId }).distinct(
    '_id'
  )

  for (const descendantId of descendantIds) {
    await deleteEntityAndDescendants(descendantId, entityType)
  }

  await EntityModel.findByIdAndDelete(entityId)

  return `${entityType} and its descendants have been removed`
}

/**
 * Delete an entity and clean up references.
 *
 * @param {string} entityId
 * @param {string} entityType
 * @returns {Promise<string>}
 */
const deleteEntityAndCleanReferences = async (entityId, entityType) => {
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

module.exports = [deleteEntity, deleteEntityAndDescendants]
