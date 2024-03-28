/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users
 *     description: Retrieves the list of all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user's profile
 *     description: Retrieves the profile of the authenticated user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /profile/{id}:
 *  put:
 *    summary: Update a user's profile
 *    description: Updates the profile of a user by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user ID
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserUpdate'
 *    tags:
 *      - Users
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Invalid ID or request body
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal Server Error
 */

/**
 * @swagger
 * /{id}:
 *  delete:
 *    summary: Delete a user
 *    description: Deletes a user by their ID
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user ID
 *    tags:
 *      - Users
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Invalid ID
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal Server Error
 */

const express = require('express')
const {
  getUsers,
  getUserProfile,
  getUserById,
  updateUserProfile,
  deleteUser,
} = require('../controllers/user.controller')
// const { authMiddleware, isAdminOrOwner } = require('../middleware/authenticate.middleware');
const {
  authMiddleware,
} = require('../middlewares/security/authenticate.middleware')
const {
  isAdminOrOwner,
} = require('../middlewares/security/verifyRoles.middleware')
const {
  validateMongoId,
  validateUserUpdate,
} = require('../validation/inputValidator')
const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.get('/profile', authMiddleware, getUserProfile)
router.get('/:id', authMiddleware, validateMongoId, getUserById)
router.put(
  '/profile/:id',
  authMiddleware,
  isAdminOrOwner,
  validateMongoId,
  validateUserUpdate,
  updateUserProfile
)
router.delete(
  '/:id',
  authMiddleware,
  validateMongoId,
  isAdminOrOwner,
  deleteUser
)

module.exports = router
