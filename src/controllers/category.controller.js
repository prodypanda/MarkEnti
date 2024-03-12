const Category = require('../models/category.model')
const validateNestingLevel = require('../helpers/validateNestingLevel')
const [deleteEntity] = require('../helpers/deleteNodedEntity')
const retrieveEntityTree = require('../helpers/retrieveEntityTree')
const slugify = require('../utils/stringUtils')

/**
 * Create a new category in the system.
 * @param {object} req - The request object containing new category details.
 * @param {object} res - The response object to send back the newly created category.
 */
exports.createCategory = async (req, res) => {
  const {
    name,
    description,
    parent,
    image,
    icon,
    isActive,
    sortOrder,
    seoTitle,
    seoDescription
  } = req.body

  // slugify the string
  let toslogify
  if (req.body.slug || req.body.slug == !null) {
    toslogify = req.body.slug
  } else {
    toslogify = req.body.name
  }
  // slugifying methode: ancrement or random or slugifyMiddleware
  const slug = await slugify(toslogify, 'category', 'slugifyMiddleware')
  console.log(`slug: ${slug}`)
  try {
    const category = new Category({
      name,
      description,
      parent,
      image,
      icon,
      isActive,
      sortOrder,
      seoTitle,
      seoDescription,
      slug
    })
    await category.validate()
    const savedCategory = await category.save()
    res.status(201).json(savedCategory)
  } catch (error) {
    if (error.code === 11000) {
      // Determine which field caused the duplicate key error
      const field = Object.keys(error.keyValue || {})[0]
      let errorMessage = 'Duplicate field error'
      if (field === 'name') {
        errorMessage = `Category name "${name}" already exists, please choose another name.`
      } else if (field === 'slug') {
        errorMessage = `Slug "${slug}" already exists, please choose another slug.`
      } else {
        errorMessage = `${field} already exists, please choose another one.`
      }

      res.status(400).json({
        success: false,
        message: errorMessage
      })
    } else {
      // Handle other errors
      res.status(400).json({
        success: false,
        message:
          error.message || 'An error occurred while creating the category.'
      })
    }
  }
}

/**
 * Update an existing category in the system.
 * @param {object} req - The request object containing updated category details.
 * @param {object} res - The response object to send back the updated category.
 */
exports.updateCategory = async (req, res) => {
  const { id } = req.params
  const {
    name,
    description,
    parent,
    isActive,
    image,
    icon,
    sortOrder,
    seoTitle,
    seoDescription,
    slug
  } = req.body

  const updateFields = {}
  if (name || name == !null) updateFields.name = name // INPUT_REQUIRED {Handle any additional fields here}
  if (description || description == !null) {
    updateFields.description = description
  }
  if (parent || parent == !null) updateFields.parent = parent // INPUT_REQUIRED {Handle any additional fields here}
  if (isActive || isActive == !null) updateFields.isActive = isActive
  if (image || image == !null) updateFields.image = image
  if (icon || icon == !null) updateFields.icon = icon
  if (sortOrder || sortOrder == !null) updateFields.sortOrder = sortOrder
  if (seoTitle || seoTitle == !null) updateFields.seoTitle = seoTitle
  if (seoDescription || seoDescription == !null) {
    updateFields.seoDescription = seoDescription
  }
  if (slug || slug == !null) {
    updateFields.slug = await slugify(slug, 'category', 'slugifyMiddleware')
  }

  try {
    await validateNestingLevel(parent, 'category')
    // const category = await Category.findByIdAndUpdate(
    //   id,
    //   { $set: updateFields },
    //   { new: true }
    // )

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    } else {
      category.set(updateFields)
      await category.validate()
    }
    const savedCategory = await category.save()
    return res.status(201).json(savedCategory)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

/**
 * Delete a category from the system.
 * @param {object} req - The request object containing the category ID.
 * @param {object} res - The response object confirming deletion.
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const WithDescendants = req.query.withDescendants === 'true' // Check query parameter for delete with descendants or with references only
    const returnMsg = await deleteEntity(id, 'category', WithDescendants)
    return res.status(200).json({ message: returnMsg })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

/**
 * Retrieve all categories in the system.
 * @param {object} req - The request object.
 * @param {object} res - The response object with all categories.
 */
exports.getCategories = async (req, res) => {
  try {
    const { start, end } = req.query // Extract start and end from query parameters

    // Convert start and end to numbers and calculate limit
    const startIndex = parseInt(start, 10) || 0 // Default to 0 if not provided
    const endIndex = parseInt(end, 10) || 0 // Default to 0 if not provided
    const limit = endIndex ? endIndex - startIndex + 1 : undefined // Calculate limit based on end and start
    // console.log(end)
    // console.log(limit)

    // Count the total number of categories
    const totalCount = await Category.countDocuments({}) // You can add any specific filters if necessary

    const categoriesTree = await retrieveEntityTree(
      'category',
      null,
      req.filter,
      req.sort,
      startIndex,
      limit
    )

    // Set the x-total-count header with the total count
    res.setHeader('x-total-count', totalCount.toString())
    return res.status(200).json(categoriesTree)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

/**
 * Retrieve a single category by its ID.
 * @param {object} req - The request object containing the category ID.
 * @param {object} res - The response object with the requested category details.
 */
exports.getCategory = async (req, res) => {
  const { id } = req.params
  try {
    // todo!
    // add functionality for the admin to show non activated (hidden) catgories.
    const category = await Category.findById(id).where('isActive').equals(true)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    const ancestors = await Category.find({ _id: { $in: category.ancestors } })
    res.status(200).json({
      ancestors: ancestors.map((ancestor) => {
        return {
          _id: ancestor._id,
          name: ancestor.name,
          parent: ancestor.parent,
          ancestors: ancestor.ancestors
        }
      }),
      category
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

exports.uploadCategoryImage = async (req, res) => {
  const { id } = req.params
  if (!req.file) return res.status(400).send('No image file provided.')

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        image: `/images/${req.file.filename}`
      },
      { new: true }
    )

    if (!category) return res.status(404).send('Category not found.')

    return res
      .status(200)
      .json({ message: 'Image uploaded successfully.', category })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
