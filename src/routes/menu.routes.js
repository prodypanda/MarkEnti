const express = require('express')
const {
  createMenu,
  updateMenu,
  deleteMenu,
  getMenus,
  getMenusById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItems,
  reorderMenuItems,
  getMenuItemsById
} = require('../controllers/menu.controller')
const {
  authMiddleware
} = require('../middlewares/security/authenticate.middleware')
const {
  validateMongoId,
  validateMenuCreate,
  validateMenuUpdate
} = require('../validation/inputValidator')

const router = express.Router()

router.post('/items', authMiddleware, createMenuItem)
router.put('/items/:id', authMiddleware, validateMongoId, updateMenuItem)
router.delete('/items/:id', authMiddleware, validateMongoId, deleteMenuItem)
router.get('/items/:id', authMiddleware, getMenuItemsById)
router.get('/items', authMiddleware, getMenuItems)
router.post('/items/reorder', authMiddleware, reorderMenuItems)

router.post('/', authMiddleware, validateMenuCreate, createMenu)
router.put(
  '/:id',
  authMiddleware,
  validateMongoId,
  validateMenuUpdate,
  updateMenu
)
router.delete('/:id', authMiddleware, validateMongoId, deleteMenu)
router.get('/', authMiddleware, getMenus)
router.get('/:id', authMiddleware, validateMongoId, getMenusById)

/**
 * @swagger
 * /api/menus/items:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /api/menus/items/{id}:
 *   put:
 *     summary: Update an existing menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/MenuItemId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/MenuItemId'
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /api/menus/items/{id}:
 *   get:
 *     summary: Get a menu item by ID
 *     tags: [Menu Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu item ID
 *     responses:
 *       200:
 *         description: The menu item object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/menus/items:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The array of menu item objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/menus/items/reorder:
 *   post:
 *     summary: Reorder menu items
 *     tags: [Menu Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *     responses:
 *       200:
 *         description: Menu items reordered
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * tags:
 *   name: Menus
 *   description: Menu management APIs
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * /api/menus:
 *   post:
 *     summary: Create a new menu
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       201:
 *         description: Menu created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/menus/{id}:
 *  put:
 *    summary: Update an existing menu
 *    tags: [Menus]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The menu id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Menu'
 *    responses:
 *      200:
 *        description: Menu updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Menu'
 *      400:
 *        $ref: '#/components/responses/BadRequestError'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/ForbiddenError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/menus:
 *   get:
 *     summary: Get all menus
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/menus/{id}:
 *   get:
 *     summary: Get menu by ID
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Menu ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

module.exports = router
