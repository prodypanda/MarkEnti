const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')
const deleteElement = async (
  categoryId,
  modelType,
  deleteWithDescendants = true
) => {
  if (deleteWithDescendants) {
    await deleteWithDescendants(categoryId, modelType) // Existing logic
  } else {
    await deleteAndCleanReferences(categoryId, modelType)
  }
}

const deleteWithDescendants = async (categoryId, modelType) => {
  let Model
  if (modelType === 'menuitem') {
    Model = MenuItem
  } else if (modelType === 'category') {
    Model = Category
  } else {
    Model = Category
  }
  const descendants = await Model.find({ parent: categoryId }).distinct('_id')
  for (const descendantId of descendants) {
    await deleteWithDescendants(descendantId, modelType)
  }
  await Model.findByIdAndDelete(categoryId)
  return modelType + ' and its descendants have been removed'
}

const deleteAndCleanReferences = async (categoryId, modelType) => {
  let Model
  if (modelType === 'menuitem') {
    Model = MenuItem
  } else if (modelType === 'category') {
    Model = Category
  } else {
    Model = Category
  }
  // 1. Delete the main element
  await Model.findByIdAndDelete(categoryId)

  // 2. Update references and ancestors
  await Model.updateMany(
    { parent: categoryId },
    {
      parent: '', // Set parent to blank
      $pull: { ancestors: categoryId }, // Remove from ancestors array
    }
  )
  return modelType + ' and its references has been removed'
}

// const deleteAndClean = async (modelId, modelType) => {
//   let Model
//   if (modelType === 'menuitem') {
//     Model = MenuItem
//   } else if (modelType === 'category') {
//     Model = Category
//   } else {
//     Model = Category
//   }

//   const descendants = await Model.find({ parent: modelId }).distinct('_id')
//   for (const descendantId of descendants) {
//     await deleteAndClean(descendantId, modelType)
//   }

//   const model = await Model.findById(modelId)
//   model.set({ parent: null })
//   await model.validate()
//   await model.save()
//   await Model.findByIdAndDelete(modelId)
// }
module.exports = [deleteElement, deleteWithDescendants]
