const express = require('express');
const { createMenu, updateMenu, deleteMenu, getMenus, getMenusById, createMenuItem, updateMenuItem, deleteMenuItem, getMenuItems, reorderMenuItems } = require('../controllers/menu.controller');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { validateMongoId, validateMenuCreate, validateMenuUpdate } = require('../validation/inputValidator')

const router = express.Router();



router.post('/items', isAuthenticated, createMenuItem);
router.put('/items/:id', isAuthenticated, validateMongoId, updateMenuItem);
router.delete('/items/:id', isAuthenticated, validateMongoId, deleteMenuItem);
router.get('/items/:menuId', isAuthenticated, getMenuItems);
router.post('/items/reorder', isAuthenticated, reorderMenuItems);

router.post('/', isAuthenticated, validateMenuCreate, createMenu);
router.put('/:id', isAuthenticated, validateMongoId, validateMenuUpdate, updateMenu);
router.delete('/:id', isAuthenticated, validateMongoId, deleteMenu);
router.get('/', isAuthenticated, getMenus);
router.get('/:id', isAuthenticated, validateMongoId, getMenusById);

module.exports = router;
