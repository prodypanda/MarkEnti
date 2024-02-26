const express = require('express');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { getMyRole, getRole, getRoles, createRole, updateRole, deleteRole } = require('../controllers/role.controller');
// const {  createRole } = require('../controllers/role.controller');

const router = express.Router();

router.get('/myRole', isAuthenticated,  getMyRole)

router.post('/', isAuthenticated,  createRole)
router.put('/:id', isAuthenticated,  updateRole)
router.delete('/:id', isAuthenticated, deleteRole)
router.get('/', isAuthenticated,  getRoles)
router.get('/:id', isAuthenticated, getRole)


// router.put('/myRole', isAuthenticated,  updateMyRole)
module.exports = router;
