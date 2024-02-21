const { check, validationResult } = require('express-validator');

// Include this file in routes where category creation or updation is handled.
exports.validateCategory = [
  check('name').not().isEmpty().withMessage('Category name is required'),
  check('description').not().isEmpty().withMessage('Category description is required'),
  check('seoTitle').optional().trim().isLength({ max: 60 }).withMessage('SEO title must not exceed 60 characters'),
  check('seoDescription').optional().trim().isLength({ max: 160 }).withMessage('SEO description must not exceed 160 characters'),
  check('slug').optional().trim().isSlug().withMessage('Slug must be a valid slug'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
