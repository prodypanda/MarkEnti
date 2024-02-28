const express = require('express');
const { getUsers, getUserProfile, getUserById, updateUserProfile, deleteUser } = require('../controllers/user.controller');
// const { isAuthenticated, isAdminOrOwner } = require('../middleware/authenticate.middleware');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { isAdminOrOwner } = require('../middlewares/security/verifyRoles.middleware');
const router = express.Router();

router.get('/', isAuthenticated, getUsers);
router.get('/profile', isAuthenticated, getUserProfile);
router.get('/:id', isAuthenticated, getUserById);
router.put('/profile/:id', isAuthenticated, isAdminOrOwner, updateUserProfile);
router.delete('/:id', isAuthenticated, isAdminOrOwner, deleteUser);

module.exports = router;
