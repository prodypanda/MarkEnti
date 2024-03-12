const Category = require('../models/category.model')
const Product = require('../models/product.model')
const Menu = require('../models/menu.model')
const MenuItem = require('../models/menuItem.model')
const crypto = require('crypto')
const slugifyMiddleware = require('slugify')
//ancrement or random or slugifyMiddleware
/**
 * Generates a unique slug for the given model type and slug text.
 *
 * @param {string} slug - The initial slug text to slugify.
 * @param {string} type - The model type ('category', 'product', etc).
 * @param {string} [method='increment'] - The method to use for ensuring uniqueness.
 *
 * The method can be one of:
 * - 'increment' - Appends an incrementing number to the slug if not unique.
 * - 'random' - Appends a random string if not unique.
 * - 'slugifyMiddleware' - Uses the slugify middleware to generate a unique slug.
 *
 * The slug is lowercased, whitespace is replaced with dashes, and non-alphanumeric
 * characters are removed.
 *
 * Returns the generated unique slug string.
 */
const slugify = async (slug, type, methode = 'ancrement') => {
  let element
  if (type === 'category') {
    element = Category
  } else if (type === 'product') {
    element = Product
  } else if (type === 'menu') {
    element = Menu
  } else if (type === 'menuItem') {
    element = MenuItem
  } else {
    throw new Error('type must be category or product or menu')
  }

  let newSlug

  if (methode === 'ancrement') {
    newSlug = slug
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    let existingElement = await element.findOne({ slug: newSlug })
    let counter = 1
    console.log(existingElement)
    while (existingElement) {
      newSlug = `${newSlug}-${counter}`
      existingElement = await element.findOne({ slug: newSlug })
      counter++
    }
  } else if (methode === 'random') {
    newSlug = slug
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    let existingElement = await element.findOne({ slug: newSlug })
    while (existingElement) {
      newSlug =
        newSlug +
        '-' +
        Math.floor(Math.random() * 99) +
        crypto
          .randomBytes(Math.ceil((6 * 3) / 4))
          .toString('base64') // Convert to base64 format
          .replace(/\+/g, '0') // Replace + symbols with 0
          .replace(/\//g, '0') // Replace / symbols with 0
          .slice(0, 6)
    }
  } else if (methode === 'slugifyMiddleware') {
    newSlug = slugifyMiddleware(slug, { lower: true })
    // Check for uniqueness
    let count = 0
    while (true) {
      try {
        let existingElement = await element.findOne({ slug: newSlug })
        if (!existingElement) {
          // No conflict or same element, break the loop
          break
        }
        count++
        // Create a new slug
        newSlug = `${slugifyMiddleware(newSlug, { lower: true })}-${count}`
      } catch (err) {
        return next(err)
      }
    }
  }

  return newSlug
}

module.exports = slugify
