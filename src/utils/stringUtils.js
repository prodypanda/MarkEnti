const Category = require('../models/category.model')
const crypto = require('crypto')
//ancrement or random
const slugify = async (slug, name, dupkey = 'ancrement') => {
  let newSlug
  if (slug) {
    newSlug = slug
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  } else if (!slug && name) {
    newSlug = name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  if (dupkey === 'ancrement') {
    let existingCategory = await Category.findOne({ slug: newSlug })
    let counter = 1
    console.log(existingCategory)
    while (existingCategory) {
      newSlug = `${newSlug}-${counter}`
      existingCategory = await Category.findOne({ slug: newSlug })
      counter++
    }
  } else if (dupkey === 'random') {
    let existingCategory = await Category.findOne({ slug: newSlug })
    while (existingCategory) {
      newSlug =newSlug +'-' + Math.floor(Math.random() * 99) + crypto
          .randomBytes(Math.ceil((6 * 3) / 4))
          .toString('base64') // Convert to base64 format
          .replace(/\+/g, '0') // Replace + symbols with 0
          .replace(/\//g, '0') // Replace / symbols with 0
          .slice(0, 6)
    }
  }

  return newSlug
}

module.exports = slugify
