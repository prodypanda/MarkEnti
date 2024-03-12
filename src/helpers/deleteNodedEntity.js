const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')
// Helper function to delete an entity and all of its descendant entities by entity ID and entity type.
/**
 * Recursively deletes an entity and all of its descendant entities by entity ID and entity type.
 *
 * @param {string} entityId - The ID of the entity to delete.
 * @param {string} entityType - The type of entity (model name).
 * @returns {Object} - Promise resolving to object with 'message' indicating entities were deleted.
 */
const deleteEntityAndDescendants = async (entityId, entityType) => {
  const EntityModel = getEntityModel(entityType)

  const descendantIds = await EntityModel.find({ parent: entityId }).distinct(
    '_id'
  )

  await Promise.all(
    descendantIds.map(async (descendantId) => {
      await deleteEntityAndDescendants(descendantId, entityType)
    })
  )

  await EntityModel.findByIdAndDelete(entityId)

  return { message: `${entityType} and its descendants have been removed` }
}
// Helper function to delete an entity and clean up references to it in other documents
/**
 * Delete an entity and clean up references to it in other documents.
 *
 * Finds the entity by ID and deletes it. Also updates any documents
 * referencing the deleted entity to remove the reference and update
 * metadata like isTopLevel and ancestors.
 *
 * @param {string} entityId - The ID of the entity to delete.
 * @param {string} entityType - The type of entity (model name).
 * @returns {Object} - Promise resolving to object indicating entity and references were deleted.
 */
const deleteEntityAndCleanReferences = async (entityId, entityType) => {
  const EntityModel = getEntityModel(entityType)

  await EntityModel.findByIdAndDelete(entityId)

  await Promise.all([
    EntityModel.updateMany(
      { parent: entityId },
      {
        parent: null,
        isTopLevel: true,
        $pull: { ancestors: entityId },
      }
    ),
    EntityModel.updateMany(
      { ancestors: entityId },
      { $pull: { ancestors: entityId } }
    ),
  ])

  return { message: `${entityType} and its references have been removed` }
}
// Helper function to delete an entity by ID.
/**
 * Deletes an entity by ID.
 *
 * @param {string} entityId - The ID of the entity to delete.
 * @param {string} entityType - The type of the entity (e.g. 'category', 'menuitem').
 * @param {boolean} [deleteDescendants=true] - Whether to recursively delete descendant entities.
 * @returns {Promise<string>} A message indicating the entity was deleted.
 * @throws {Error} If entityType is invalid.
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
// Helper function to get the Mongoose model for the given entity type.<ctrl63>
/**
 * Get the Mongoose model for the given entity type.
 *
 * @param {string} entityType
 * @returns {Model}
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

module.exports = [deleteEntity, deleteEntityAndDescendants]
