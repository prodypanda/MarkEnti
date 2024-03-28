const express = require('express')

// const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');
// const { authMiddleware } = require('../middlewares/security/authenticate.middleware');
// const { isAdminOrOwner } = require('../middlewares/security/verifyRoles.middleware');
const {
  authMiddleware,
} = require('../middlewares/security/authenticate.middleware')
const {
  validatePermission,
  validateMongoId,
} = require('../validation/inputValidator')

const {
  getMyPermissions,
  getPermission,
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} = require('../controllers/permission.controller')

const router = express.Router()

router.get('/myPermissions', authMiddleware, getMyPermissions)

router.post('/', authMiddleware, validatePermission, createPermission)
router.put(
  '/:id',
  authMiddleware,
  validateMongoId,
  validatePermission,
  updatePermission
)

router.delete('/:id', authMiddleware, validateMongoId, deletePermission)
router.get('/', authMiddleware, getPermissions)
router.get('/:id', authMiddleware, validateMongoId, getPermission)

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permission management APIs
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/permissions/{id}:
 *  put:
 *    summary: Update a permission
 *    tags: [Permissions]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Permission ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Permission'
 *    responses:
 *      200:
 *        description: Updated
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/ForbiddenError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 *      422:
 *        $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/permissions/myPermissions:
 *   get:
 *     summary: Get my permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

module.exports = router
