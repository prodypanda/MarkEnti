const Category = require('../models/category.model')
const MenuItem = require('../models/menuItem.model')

const deleteWithDescendants = async (categoryId, ModelType) => {
  let Model
  if (ModelType === 'menuitem') {
    Model = MenuItem
  } else if (ModelType === 'category') {
    Model = Category
  } else {
    Model = Category
  }

  const descendants = await Model.find({ parent: categoryId }).distinct('_id')
  for (const descendantId of descendants) {
    await deleteWithDescendants(descendantId, ModelType)
  }
  await Model.findByIdAndDelete(categoryId)
}

const deleteAndClean = async (modelId, ModelType) => {
  let Model
  if (ModelType === 'menuitem') {
    Model = MenuItem
  } else if (ModelType === 'category') {
    Model = Category
  } else {
    Model = Category
  }

  const descendants = await Model.find({ parent: modelId }).distinct('_id')
  for (const descendantId of descendants) {
    await deleteAndClean(descendantId, ModelType)
  }

  const model = await Model.findById(modelId)
  model.set({ parent: null })
  await model.validate()
  await model.save()
  await Model.findByIdAndDelete(modelId)
}
module.exports = [deleteWithDescendants, deleteAndClean]
