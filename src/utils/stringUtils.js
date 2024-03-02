const Category = require('../models/category.model')
const Product = require('../models/product.model')
const Menu = require('../models/menu.model')
const MenuItem = require('../models/menuItem.model')
const crypto = require('crypto')
const slugifyMiddleware = require('slugify');
//ancrement or random or slugifyMiddleware
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
      newSlug = newSlug +'-' + Math.floor(Math.random() * 99) + crypto
          .randomBytes(Math.ceil((6 * 3) / 4))
          .toString('base64') // Convert to base64 format
          .replace(/\+/g, '0') // Replace + symbols with 0
          .replace(/\//g, '0') // Replace / symbols with 0
          .slice(0, 6)
    }
  } else if (methode === 'slugifyMiddleware') {
    
    newSlug = slugifyMiddleware(slug, { lower: true });
    // Check for uniqueness
    let count = 0;
    while(true) {
      try {
        let existingElement = await element.findOne({ slug: newSlug });
        if (!existingElement) {
          // No conflict or same element, break the loop
          break;
        }
        count++;
        // Create a new slug
        newSlug = `${slugifyMiddleware(newSlug, { lower: true })}-${count}`;
      } catch(err) {
        return next(err);
      }
    }


  }

  return newSlug
}

module.exports = slugify
