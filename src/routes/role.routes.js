const express = require('express');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { validateRole } = require('../validation/inputValidator')
const { getMyRole, getRole, getRoles, createRole, updateRole, deleteRole } = require('../controllers/role.controller');
// const {  createRole } = require('../controllers/role.controller');

const router = express.Router();

router.get('/myRole', isAuthenticated,  getMyRole)

router.post('/', isAuthenticated, validateRole,  createRole)
router.put('/:id', isAuthenticated, validateRole,  updateRole)
router.delete('/:id', isAuthenticated, deleteRole)
router.get('/', isAuthenticated,  getRoles)
router.get('/:id', isAuthenticated, getRole)


// router.put('/myRole', isAuthenticated,  updateMyRole)
module.exports = router;
