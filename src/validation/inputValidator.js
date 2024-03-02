const { check, validationResult } = require('express-validator');
const stylelint = require('stylelint');
const slugifyMiddleware = require('slugify');
const User = require('../models/user.model')



// Include this file in routes where permission creation or updation is handled.
exports.validateMongoId = [
  check('id')
  .isMongoId().withMessage('Invalid id format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];




// Include this file in routes where user creation or updation is handled.
exports.validateUserRegister = [
  check('username').not().isEmpty().withMessage('Username is required').trim().escape().isLength({ min: 4, max: 20 }).withMessage('Username must be between 4 and 20 characters')
  .custom(async value => {
    const existingUser = await User.findOne({username:value});
    if (existingUser) {
      throw new Error('A user already exists with the same username, please choose another username');
    }
  }),
  check('email').trim().isEmail().withMessage('Must be a valid email address').escape()
  .custom(async value => {
    const existingUser = await User.findOne({email:value});
    if (existingUser) {
      throw new Error('A user already exists with this e-mail address, please choose another e-mail address');
    }
  }),
  check('role').optional().trim().custom((value) => {
    if (['root', 'admin', 'manager', 'customer', 'guest'].includes(value)) {
      return true; // Validation succeeded
    }
    throw new Error('role is not valid'); // Throw error if validation fails
  }),
  check('password').trim()
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: process.env.REGISTERATION_PASSWORD_MIN_LENGTH || 6 })
    .withMessage(`Password must be at least ${process.env.REGISTERATION_PASSWORD_MIN_LENGTH || 6} characters`),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      if (process.env.NODE_ENV === 'production') {
        return res.status(422).json({ errors: errors.array() })
      } else if (process.env.NODE_ENV === 'dev') {
        // Modify the errors array to exclude "value" and "location"
        const filteredErrors = errors.array().map((error) => {
          return {
            type: 'field',
            msg: error.msg,
            path: error.path, // "param" is the field name, equivalent to your desired "path".
            // Comment out or remove both "value" and "location" as they are not needed in the response.
            // value: error.value,       // This line can be removed as you don't want value in the response.
            // location: error.location, // This line can be removed as you don't want location in the response.
          }
        })
        // Send the modified error response
        return res.status(422).json({ errors: filteredErrors })
      } else {
        return res.status(500).json({ errors: 'server error 500 - Code*447101' })
      }
    }
    next()
  },
];


// Include this file in routes where permission creation or updation is handled.
exports.validateUserLogin = [
  check('email').trim().isEmail().withMessage('You must provide a valid email address').escape()
  .custom(async value => {
    const existingUser = await User.findOne({email:value});
    if (!existingUser) {
      throw new Error('No user exists with this e-mail address, please register first');
    }
  }),
  check('password').trim().not().isEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];


// Include this file in routes where permission creation or updation is handled.
exports.validateUserUpdate = [
  check('username').if((value, { req }) => req.body.username) // Only validate if username is being updated
  .trim().escape().not().isEmpty().withMessage('Username is required').isLength({ min: 4, max: 20 }).withMessage('Username must be between 4 and 20 characters')
  .custom(async value => {
    const existingUser = await User.findOne({username:value});
    if (existingUser) {
      throw new Error('A user already exists with the same username, please choose another username');
    }
  }),
  check('email').if((value, { req }) => req.body.email) // Only validate if email is being updated
  .trim().isEmail().withMessage('Must be a valid email address').escape()
  .custom(async value => {
    const existingUser = await User.findOne({email:value});
    if (existingUser) {
      throw new Error('A user already exists with this e-mail address, please choose another e-mail address');
    }
  }),
  check('role').if((value, { req }) => req.body.role).optional().trim().custom((value) => {
    if (['root', 'admin', 'manager', 'customer', 'guest'].includes(value)) {
      return true; // Validation succeeded
    }
    throw new Error('role is not valid'); // Throw error if validation fails
  }),
  check('password').if((value, { req }) => req.body.password).trim()
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: process.env.REGISTERATION_PASSWORD_MIN_LENGTH || 6 })
    .withMessage(`Password must be at least ${process.env.REGISTERATION_PASSWORD_MIN_LENGTH || 6} characters`),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      if (process.env.NODE_ENV === 'production') {
        return res.status(422).json({ errors: errors.array() })
      } else if (process.env.NODE_ENV === 'dev') {
        // Modify the errors array to exclude "value" and "location"
        const filteredErrors = errors.array().map((error) => {
          return {
            type: 'field',
            msg: error.msg,
            path: error.path, // "param" is the field name, equivalent to your desired "path".
            // Comment out or remove both "value" and "location" as they are not needed in the response.
            // value: error.value,       // This line can be removed as you don't want value in the response.
            // location: error.location, // This line can be removed as you don't want location in the response.
          }
        })
        // Send the modified error response
        return res.status(422).json({ errors: filteredErrors })
      } else {
        return res.status(500).json({ errors: 'server error 500 - Code*447101' })
      }
    }
    next()
  },
];





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
exports.validateCategoryCreate = [
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



// Include this file in routes where category creation or updation is handled.
exports.validateCategoryUpdate = [
  check('name').if((value, { req }) => req.body.name) // Only validate if name is being updated
  .not().isEmpty().withMessage('Category name is required')
  .blacklist('/\\|&@<>#%^*/').isLength({ min: 3, max: 50 }).withMessage('Category name must be between 3 and 50 characters')
  .escape(),
  check('description').if((value, { req }) => req.body.description)
  .not().isEmpty().withMessage('Category description is required').escape(),
  check('seoTitle').if((value, { req }) => req.body.seoTitle)
  .optional().trim().isLength({ max: 60 }).withMessage('SEO title must not exceed 60 characters').blacklist('/\\|&@<>#%^*/').escape(),
  check('seoDescription').if((value, { req }) => req.body.seoDescription)
  .optional().trim().isLength({ max: 160 }).withMessage('SEO description must not exceed 160 characters').escape(),
  check('slug').if((value, { req }) => req.body.slug)
  .optional().trim().customSanitizer(value => slugifyMiddleware(value, { lower: true })) // Sanitize first
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



// Include this file in routes where permission creation or updation is handled.
exports.validateInventoryNumeric = [
  check('count')
  .isNumeric().withMessage('Count must be a number')
  .isInt({ min: 0, max: 99999 }).withMessage('Count must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];


// Include this file in routes where permission creation or updation is handled.
exports.validateCartImput = [
  check('quantity')
  .isNumeric().withMessage('Count must be a number')
  .isInt({ min: 0, max: 99999 }).withMessage('Count must be a positive integer'),
  check('id')
  .isMongoId().withMessage('Invalid id format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];




// Include this file in routes where category creation or updation is handled.
exports.validatePageCreate = [
  check('title').not().isEmpty().withMessage('Page title is required')
  .blacklist('/\\|&@<>#%^*/').isLength({ min: 3, max: 50 }).withMessage('Page title must be between 3 and 50 characters')
  .escape(),
  check('content').not().isEmpty().withMessage('Page content is required').isLength({ min: 1, max: 50000 }).withMessage('Page content must be between 1 and 50000 characters').escape(),
  check('slug').optional().trim().customSanitizer(value => slugifyMiddleware(value, { lower: true })) // Sanitize first
  .isSlug().withMessage('Slug must be a valid slug')
  .blacklist('/\\|&@<>#%^*/'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];


// Include this file in routes where category creation or updation is handled.
exports.validatePageUpdate = [
  check('title').if((value, { req }) => req.body.title) // Only validate if title is being updated
  .not().isEmpty().withMessage('Page title is required')
  .blacklist('/\\|&@<>#%^*/').isLength({ min: 3, max: 50 }).withMessage('Page title must be between 3 and 50 characters')
  .escape(),
  check('content').if((value, { req }) => req.body.content) // Only validate if content is being updated
  .not().isEmpty().withMessage('Page content is required').isLength({ min: 1, max: 50000 }).withMessage('Page content must be between 1 and 50000 characters').escape(),
  check('slug').if((value, { req }) => req.body.slug) // Only validate if slug is being updated
  .optional().trim().customSanitizer(value => slugifyMiddleware(value, { lower: true })) // Sanitize first
  .isSlug().withMessage('Slug must be a valid slug')
  .blacklist('/\\|&@<>#%^*/'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];


// Include this file in routes where category creation is handled.
exports.validateDesignConfigCreate = [
  // Theme validations
  check('theme').not().isEmpty().withMessage('theme is required')
  .blacklist('/\\|&@<>#%^*/').isLength({ min: 1, max: 100 }).withMessage('Thame name must be between 1 and 100 characters')
  .escape(),

  // Custom CSS validations
  check('customCSS').optional()
    .custom(async (value) => {
      const lintResult = await stylelint.lint({
        code: value,
      });

      if (lintResult.errored) {
        throw new Error('CSS code is invalid');
      }
    }).optional().trim().isLength({ max: 20000 }).withMessage('CSS code must not exceed 20000 characters').escape(),

  // Layout validations
  check('layout.headerPosition')
    .optional() // Only validate if this field exists
    .isIn(['top', 'left', 'right', 'bottom']).withMessage('Header position must be top, left, right, or bottom'),
  check('layout.menuPosition')
    .optional()
    .isIn(['side', 'top']).withMessage('Menu position must be side or top'),
  check('layout.sidebarPosition')
    .optional()
    .isIn(['left', 'right']).withMessage('Sidebar position must be left or right'),
  check('layout.roundedCorners')
    .optional()
    .isBoolean().withMessage('Rounded corners must be true or false'),

  // Colors validation
  check('colors.primary').optional().isHexColor().withMessage('Primary color must be a valid hex color'),
  check('colors.secondary').optional().isHexColor().withMessage('Secondary color must be a valid hex color'),
  check('colors.background').optional().isHexColor().withMessage('Background color must be a valid hex color'),
  check('colors.accent').optional().isHexColor().withMessage('Accent color must be a valid hex color'),

  // Logo validations
  check('logo.url').optional().isURL().withMessage('Logo URL must be a valid URL'),
  check('logo.altText').optional().trim().isLength({ max: 255 }).withMessage('Logo alt text must not exceed 100 characters').escape(),

  // Favicon validation
  check('favicon').optional().isURL().withMessage('Favicon URL must be a valid URL').escape(),

  // Background image
  check('backgroundImage').optional().isURL().withMessage('Background image URL must be a valid URL').escape(),

  // Typography Validations
  check('typography.fonts.header')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Header font must be between 1 and 255 characters')
    .escape(),
  check('typography.fonts.body')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Body font must be between 1 and 255 characters')
    .escape(),
  check('typography.baseFontSize')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Base font size must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h1')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H1 heading style must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h2')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H2 heading style must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h3')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H3 heading style must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h4')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H4 heading style must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h5')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H5 heading style must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h6')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H6 heading style must be between 1 and 100 characters')
    .escape(),

    // Breakpoints validations
    check('breakpoints.xs')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Extra small breakpoint must be between 1 and 100 characters')
    .escape(),
  check('breakpoints.sm')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Small breakpoint must be between 1 and 100 characters')
    .escape(),
  check('breakpoints.md')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Medium breakpoint must be between 1 and 100 characters')
    .escape(),
  check('breakpoints.lg')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Large breakpoint must be between 1 and 100 characters')
    .escape(),
  check('breakpoints.xl')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Extra large breakpoint must be between 1 and 100 characters')
    .escape(),

  // Spacing validations
  check('spacing.small')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Small spacing must be between 1 and 100 characters')
    .escape(),
  check('spacing.medium')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Medium spacing must be between 1 and 100 characters')
    .escape(),
  check('spacing.large')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Large spacing must be between 1 and 100 characters')
    .escape(),
  check('spacing.extraLarge')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Extra large spacing must be between 1 and 100 characters')
    .escape(),

  // Social media links (array validation)
  check('socialMediaLinks.*.platform')
  .optional()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Social media platform name must be between 1 and 100 characters')
  .escape(),
  check('socialMediaLinks.*.link')
  .optional()
  .isURL()
  .withMessage('Social media link must be a valid URL')
  .escape(),
  check('socialMediaLinks.*.icon')
  .optional()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Social media icon must be between 1 and 100 characters')
  .escape(),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];



// Include this file in routes where category updation is handled.
exports.validateDesignConfigUpdate = [
  // Theme validations
  check('theme').if((value, { req }) => req.body.theme)
  .not().isEmpty().withMessage('theme is required')
  .blacklist('/\\|&@<>#%^*/').isLength({ min: 1, max: 100 }).withMessage('Thame name must be between 1 and 100 characters')
  .escape(),

  // Custom CSS validations
  check('customCSS').optional()
    .custom(async (value) => {
      const lintResult = await stylelint.lint({
        code: value,
      });

      if (lintResult.errored) {
        throw new Error('CSS code is invalid');
      }
    }).optional().trim().isLength({ max: 20000 }).withMessage('CSS code must not exceed 20000 characters').escape(),

  // Layout validations
  check('layout.headerPosition')
    .optional() // Only validate if this field exists
    .isIn(['top', 'left', 'right', 'bottom']).withMessage('Header position must be top, left, right, or bottom'),
  check('layout.menuPosition')
    .optional()
    .isIn(['side', 'top']).withMessage('Menu position must be side or top'),
  check('layout.sidebarPosition')
    .optional()
    .isIn(['left', 'right']).withMessage('Sidebar position must be left or right'),
  check('layout.roundedCorners')
    .optional()
    .isBoolean().withMessage('Rounded corners must be true or false'),

  // Colors validation
  check('colors.primary').optional().isHexColor().withMessage('Primary color must be a valid hex color'),
  check('colors.secondary').optional().isHexColor().withMessage('Secondary color must be a valid hex color'),
  check('colors.background').optional().isHexColor().withMessage('Background color must be a valid hex color'),
  check('colors.accent').optional().isHexColor().withMessage('Accent color must be a valid hex color'),

  // Logo validations
  check('logo.url').optional().isURL().withMessage('Logo URL must be a valid URL'),
  check('logo.altText').optional().trim().isLength({ max: 255 }).withMessage('Logo alt text must not exceed 100 characters').escape(),

  // Favicon validation
  check('favicon').optional().isURL().withMessage('Favicon URL must be a valid URL').escape(),

  // Background image
  check('backgroundImage').optional().isURL().withMessage('Background image URL must be a valid URL').escape(),

  // Typography Validations
  check('typography.fonts.header')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Header font must be between 1 and 255 characters')
    .escape(),
  check('typography.fonts.body')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Body font must be between 1 and 255 characters')
    .escape(),
  check('typography.baseFontSize')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Base font size must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h1')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H1 heading style must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h2')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H2 heading style must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h3')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H3 heading style must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h4')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H4 heading style must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h5')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H5 heading style must be between 1 and 100 characters')
    .escape(),
  check('typography.headingStyles.h6')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('H6 heading style must be between 1 and 100 characters')
    .escape(),

    // Breakpoints validations
    check('breakpoints.xs')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Extra small breakpoint must be between 1 and 100 characters')
    .escape(),
  check('breakpoints.sm')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Small breakpoint must be between 1 and 100 characters')
    .escape(),
  check('breakpoints.md')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Medium breakpoint must be between 1 and 100 characters')
    .escape(),
  check('breakpoints.lg')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Large breakpoint must be between 1 and 100 characters')
    .escape(),
  check('breakpoints.xl')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Extra large breakpoint must be between 1 and 100 characters')
    .escape(),

  // Spacing validations
  check('spacing.small')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Small spacing must be between 1 and 100 characters')
    .escape(),
  check('spacing.medium')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Medium spacing must be between 1 and 100 characters')
    .escape(),
  check('spacing.large')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Large spacing must be between 1 and 100 characters')
    .escape(),
  check('spacing.extraLarge')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Extra large spacing must be between 1 and 100 characters')
    .escape(),

  // Social media links (array validation)
  check('socialMediaLinks.*.platform')
  .optional()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Social media platform name must be between 1 and 100 characters')
  .escape(),
  check('socialMediaLinks.*.link')
  .optional()
  .isURL()
  .withMessage('Social media link must be a valid URL')
  .escape(),
  check('socialMediaLinks.*.icon')
  .optional()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Social media icon must be between 1 and 100 characters')
  .escape(),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];





// Include this file in routes where category creation or updation is handled.
exports.validateDiscountCreate = [
  check('productId')
  .isMongoId().withMessage('Invalid product Id format'),
  check('discountPercentage')
  .not().isEmpty().withMessage('Discount Pourcentage is required').trim().escape()
  .isNumeric({ no_symbols: false, min: 0, max: 100 })
        // .isFloat({ min: 0, max: 100 })
  .withMessage('Percentage must be a number between 0 and 100'),

  check('startDate')
  .not().isEmpty().withMessage('StartDate is required').trim().escape()
  .isDate().withMessage('Invalid date format'),
  // .isDate({ format: 'YYYY-MM-DD', strict: true, min: new Date(), max: new Date() }),

  check('endDate')
  .not().isEmpty().withMessage('endDate is required').trim().escape()
  .isDate().withMessage('Invalid date format'),

  check('isActive').optional()
  .isBoolean().withMessage('Invalid boolean format, true or false'),

  check('maxUsage').optional()
  .isNumeric({ no_symbols: false, min: 0, max: 10000000000 })
  .withMessage('Invalid max usage format, must be a number between 0 and 10000000000, 0 for unlimited usage'),
  check('usageCount').optional()
  .isNumeric({ no_symbols: false, min: 0, max: 10000000000 })
  .withMessage('Invalid usage count format, must be a number between 0 and 10000000000'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];



// Include this file in routes where category creation or updation is handled.
exports.validateDiscountUpdate = [
  check('productId').if((value, { req }) => req.body.productId)
  .isMongoId().withMessage('Invalid product Id format'),

  check('discountPercentage').if((value, { req }) => req.body.discountPercentage)
  .not().isEmpty().withMessage('Discount Pourcentage is required').trim().escape()
  .isNumeric({ no_symbols: false, min: 0, max: 100 })
        // .isFloat({ min: 0, max: 100 })
  .withMessage('Percentage must be a number between 0 and 100'),

  check('startDate').if((value, { req }) => req.body.startDate)
  .not().isEmpty().withMessage('StartDate is required').trim().escape()
  .isDate().withMessage('Invalid date format'),
  // .isDate({ format: 'YYYY-MM-DD', strict: true, min: new Date(), max: new Date() }),

  check('endDate').if((value, { req }) => req.body.endDate)
  .not().isEmpty().withMessage('endDate is required').trim().escape()
  .isDate().withMessage('Invalid date format'),

  check('isActive').if((value, { req }) => req.body.isActive).optional()
  .isBoolean().withMessage('Invalid boolean format, true or false'),

  check('maxUsage').if((value, { req }) => req.body.maxUsage).optional()
  .isNumeric({ no_symbols: false, min: 0, max: 10000000000 })
  .withMessage('Invalid max usage format, must be a number between 0 and 10000000000, 0 for unlimited usage'),

  check('usageCount').if((value, { req }) => req.body.usageCount).optional()
  .isNumeric({ no_symbols: false, min: 0, max: 10000000000 })
  .withMessage('Invalid usage count format, must be a number between 0 and 10000000000'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];



exports.validateMenuCreate = [
  check('title').not().isEmpty().withMessage('Menu Title is required').blacklist('/\\|&@<>#%^*/').isLength({ min: 3, max: 100 })
  .withMessage('Menu Title must be between 3 and 100 characters').trim().escape(),

  check('slug').optional().trim().customSanitizer(value => slugifyMiddleware(value, { lower: true })) // Sanitize first
  .isSlug().withMessage('Slug must be a valid slug')
  .blacklist('/\\|&@<>#%^*/'),

  check('visible').optional().isBoolean().withMessage('Invalid boolean format, true or false'),
  check('items').isArray({min: 0, max: 1000}).withMessage('Menu items must be an array of 1000 items or less'),
  check('items.*').optional().isMongoId().withMessage('Menu items must be valid MongoDB IDs'),
  


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];


exports.validateMenuUpdate = [
  check('title').if((value, { req }) => req.body.title)
  .not().isEmpty().withMessage('Menu Title is required').blacklist('/\\|&@<>#%^*/').isLength({ min: 3, max: 100 })
  .withMessage('Menu Title must be between 3 and 100 characters').trim().escape(),

  check('slug').if((value, { req }) => req.body.slug)
  .optional().trim().customSanitizer(value => slugifyMiddleware(value, { lower: true })) // Sanitize first
  .isSlug().withMessage('Menu Slug must be a valid slug')
  .blacklist('/\\|&@<>#%^*/'),

  check('visible').if((value, { req }) => req.body.visible)
  .optional().isBoolean().withMessage('Invalid boolean format, true or false'),
  check('items').if((value, { req }) => req.body.items)
  .optional().isMongoId().withMessage('Invalid menu items Id format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];





/**
 * Validates user input from a request body.
 * Checks for required fields and runs validation on each field.
 * Returns validation errors if any, otherwise continues to next middleware.
 */
