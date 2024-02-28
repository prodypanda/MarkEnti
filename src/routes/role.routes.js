const express = require('express');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { validateRole,validateMongoId } = require('../validation/inputValidator')
const { getMyRole, getRole, getRoles, createRole, updateRole, deleteRole } = require('../controllers/role.controller');
// const {  createRole } = require('../controllers/role.controller');

const router = express.Router();

router.get('/myRole', isAuthenticated,  getMyRole)

router.post('/', isAuthenticated, validateRole,  createRole)
router.put('/:id', isAuthenticated, validateRole, validateMongoId, updateRole)
router.delete('/:id', isAuthenticated, validateMongoId, deleteRole)
router.get('/', isAuthenticated,  getRoles)
router.get('/:id', isAuthenticated, validateMongoId, getRole)


// router.put('/myRole', isAuthenticated,  updateMyRole)
module.exports = router;
