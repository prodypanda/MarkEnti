const express = require('express');
const { getMyRole, getRole, getRoles, createRole, updateMyRole, updateRole, deleteRole } = require('../controllers/role.controller');
// const {  createRole } = require('../controllers/role.controller');

const router = express.Router();

router.post('/',  createRole)
router.put('/:id',  updateRole)
router.delete('/:id', deleteRole)
router.get('/',  getRoles)
router.get('/:id', getRole)

router.get('/myRole',  getMyRole)
router.put('/myRole',  updateMyRole)
module.exports = router;
