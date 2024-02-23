const express = require('express')
const categoryController = require('../controllers/category.controller')
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware')
const {
  sortAndFilterCategories,
} = require('../middlewares/categorySorting.middleware')
const {
  uploadSingleImage,
  resizeAndFormatImage,
} = require('../middlewares/multer.middleware')
const { validateCategory } = require('../validation/category')
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */

/**
 * @swagger
 *  /api/categories/:
 *    post:
 *      summary: Creates a category
 *      tags: [Category]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      responses:
 *        "201":
 *          description: Category created successfully
 *        "400":
 *          description: Bad request
 */
router.post('/', validateCategory, categoryController.createCategory)

/**
 * @swagger
 *  /api/categories/{id}:
 *    put:
 *      summary: Updates a category
 *      tags: [Category]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Id of the category to be updated
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      responses:
 *        "200":
 *          description: Category updated successfully
 *        "400":
 *          description: Bad request
 *        "404":
 *          description: Category not found
 */

router.put('/:id', validateCategory, categoryController.updateCategory)

/**
 * @swagger
 *  /api/categories/{id}:
 *    delete:
 *      summary: Deletes a category
 *      tags: [Category]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Id of the category to be deleted
 *      responses:
 *        "200":
 *          description: Category deleted successfully
 *        "400":
 *          description: Bad request
 *        "404":
 *          description: Category not found
 */

router.delete('/:id', categoryController.deleteCategory)

/**
 * @swagger
 *  /api/categories/:
 *    get:
 *      summary: Gets a list of categories
 *      tags: [Category]
 *      responses:
 *        "200":
 *          description: A list of categories
 *        "400":
 *          description: Bad request
 */

router.get('/', sortAndFilterCategories, categoryController.getCategories)

/**
 * @swagger
 *  /api/categories/{id}:
 *    get:
 *      summary: Gets a specific category by id
 *      tags: [Category]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Id of the category to get
 *      responses:
 *        "200":
 *          description: Detailed information about the category
 *        "404":
 *          description: Category not found
 */

router.get('/:id', categoryController.getCategory)

router.post(
  '/upload-image/:id',
  uploadSingleImage,
  resizeAndFormatImage,
  categoryController.uploadCategoryImage
)

module.exports = router
