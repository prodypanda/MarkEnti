const express = require('express');

// const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');
// const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
// const { isAdminOrOwner } = require('../middlewares/security/verifyRoles.middleware');


const {  getMyPermissions, getPermission, getPermissions, createPermission, updateMyPermissions, updatePermission, deletePermission} = require('../controllers/permission.controller');

const router = express.Router();


router.post('/',  createPermission)
router.put('/:id',  updatePermission)

router.delete('/:id', deletePermission)
router.get('/',  getPermissions)
router.get('/:id', getPermission)

router.get('/myPermissions',  getMyPermissions)
router.put('/myPermissions',  updateMyPermissions)

// router.get('/myroutes', isAuthenticated, getUserProfile);
// router.put('/myroutes', isAuthenticated, isAdminOrOwner, updateUserProfile);

module.exports = router;
