const express = require('express')
const {
  isAuthenticated
} = require('../middlewares/security/authenticate.middleware')
const {
  validateRole,
  validateMongoId
} = require('../validation/inputValidator')
const {
  getMyRole,
  getRole,
  getRoles,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/role.controller')
// const {  createRole } = require('../controllers/role.controller');

const router = express.Router()

router.get('/myRole', isAuthenticated, getMyRole)

router.post('/', isAuthenticated, validateRole, createRole)
router.put('/:id', isAuthenticated, validateRole, validateMongoId, updateRole)
router.delete('/:id', isAuthenticated, validateMongoId, deleteRole)
router.get('/', isAuthenticated, getRoles)
router.get('/:id', isAuthenticated, validateMongoId, getRole)

// router.put('/myRole', isAuthenticated,  updateMyRole)

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management APIs
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/roles/{id}:
 *  get:
 *    summary: Get a role by ID
 *    tags: [Roles]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Role ID
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Role'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/roles:
 *  post:
 *    summary: Create a new role
 *    tags: [Roles]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Role'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Role'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      400:
 *        $ref: '#/components/responses/BadRequestError'
 */

/**
 * @swagger
 * /api/roles/{id}:
 *  put:
 *    summary: Update a role by ID
 *    tags: [Roles]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Role ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Role'
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Role'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 *      400:
 *        $ref: '#/components/responses/BadRequestError'
 */

/**
 * @swagger
 * /api/roles/{id}:
 *  delete:
 *    summary: Delete a role by ID
 *    tags: [Roles]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Role ID
 *    responses:
 *      200:
 *        description: Success
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 */

module.exports = router
