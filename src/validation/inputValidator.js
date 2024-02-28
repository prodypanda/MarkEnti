const { check, validationResult } = require('express-validator');
const slugifyMiddleware = require('slugify');




// Include this file in routes where permission creation or updation is handled.
exports.validatePermission = [
  check('name').not().isEmpty().withMessage('Permission name is required')
  .blacklist('/\\|&@<>#%^*/').isLength({ min: 3, max: 50 }).withMessage('Permission name must be between 3 and 50 characters').escape(),
  check('description').not().isEmpty().withMessage('Permission description is required')
  .blacklist('/\\|&@<>#%^*/').isLength({ min: 3, max: 200 }).withMessage('Permission description must be between 3 and 200 characters').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];


// Include this file in routes where role creation or updation is handled.
exports.validateRole = [
  check('name').not().isEmpty().withMessage('Role name is required')
  .blacklist('/\\|&@<>#%^*/').isLength({ min: 3, max: 50 }).withMessage('Role name must be between 3 and 50 characters').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];



// Include this file in routes where category creation or updation is handled.
exports.validateCategory = [
  check('name').not().isEmpty().withMessage('Category name is required')
  .blacklist('/\\|&@<>#%^*/').isLength({ min: 3, max: 50 }).withMessage('Category name must be between 3 and 50 characters')
  .escape(),
  check('description').not().isEmpty().withMessage('Category description is required').escape(),
  check('seoTitle').optional().trim().isLength({ max: 60 }).withMessage('SEO title must not exceed 60 characters').blacklist('/\\|&@<>#%^*/').escape(),
  check('seoDescription').optional().trim().isLength({ max: 160 }).withMessage('SEO description must not exceed 160 characters').escape(),
  check('slug').optional().trim().customSanitizer(value => slugifyMiddleware(value, { lower: true })) // Sanitize first
  .isSlug().withMessage('Slug must be a valid slug')
  .blacklist('/\\|&@<>#%^*/'),
  // check('slug').optional().trim().isSlug().withMessage('Slug must be a valid slug'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
// Product Name Blacklist
const productNameBlacklist = '/\\|&@#%^\\*';
// Description Blacklist (modify if you want to allow some HTML tags)
const descriptionBlacklist = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi; 
// const descriptionBlacklist = '<script> </script> <i> <b> <p> <br> <div>'; 
// Slug Blacklist + Space Handling
const slugBlacklist = /[^a-zA-Z0-9-]+/g; 
// const slugBlacklist = ' /\\|&@#%^*,';