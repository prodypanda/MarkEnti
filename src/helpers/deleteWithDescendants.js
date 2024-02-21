const Category = require('../models/category.model')

const deleteWithDescendants = async (categoryId) => {
  const descendants = await Category.find({ parent: categoryId }).distinct(
    '_id'
  )
  for (const descendantId of descendants) {
    await deleteWithDescendants(descendantId)
  }
  await Category.findByIdAndDelete(categoryId)
}

module.exports = deleteWithDescendants
