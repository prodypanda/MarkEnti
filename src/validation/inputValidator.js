const { check, validationResult } = require('express-validator');
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