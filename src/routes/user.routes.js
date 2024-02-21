const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');
// const { isAuthenticated, isAdminOrOwner } = require('../middleware/authenticate.middleware');
const { isAuthenticated } = require('../middleware/authenticate.middleware');
const { isAdminOrOwner } = require('../middleware/authCheck.middleware');
const router = express.Router();

router.get('/profile', isAuthenticated, getUserProfile);
router.put('/profile', isAuthenticated, isAdminOrOwner, updateUserProfile);

module.exports = router;
