const express = require('express');
const { getUsers, getUserProfile, getUserById, updateUserProfile, deleteUser } = require('../controllers/user.controller');
// const { isAuthenticated, isAdminOrOwner } = require('../middleware/authenticate.middleware');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { isAdminOrOwner } = require('../middlewares/security/verifyRoles.middleware');
const { validateMongoId, validateUserUpdate } = require('../validation/inputValidator')
const router = express.Router();

router.get('/', isAuthenticated, getUsers);
router.get('/profile', isAuthenticated, getUserProfile);
router.get('/:id', isAuthenticated, validateMongoId, getUserById);
router.put('/profile/:id', isAuthenticated, isAdminOrOwner, validateMongoId, validateUserUpdate, updateUserProfile);
router.delete('/:id', isAuthenticated, validateMongoId, isAdminOrOwner, deleteUser);

module.exports = router;
