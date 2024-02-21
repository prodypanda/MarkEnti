const express = require('express');
const { createMenu, updateMenu, deleteMenu, getMenus, createMenuItem, updateMenuItem, deleteMenuItem, getMenuItems, reorderMenuItems } = require('../controllers/menu.controller');
const { isAuthenticated } = require('../middleware/authenticate.middleware');
const router = express.Router();

router.post('/', isAuthenticated, createMenu);
router.put('/:id', isAuthenticated, updateMenu);
router.delete('/:id', isAuthenticated, deleteMenu);
router.get('/', isAuthenticated, getMenus);

router.post('/items', isAuthenticated, createMenuItem);
router.put('/items/:id', isAuthenticated, updateMenuItem);
router.delete('/items/:id', isAuthenticated, deleteMenuItem);
router.get('/items/:menuId', isAuthenticated, getMenuItems);
router.post('/items/reorder', isAuthenticated, reorderMenuItems);

module.exports = router;
