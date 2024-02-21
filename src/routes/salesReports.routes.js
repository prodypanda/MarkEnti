const express = require('express');
const { getSalesReport } = require('../controllers/salesReports.controller');
const { isAuthenticated } = require('../middleware/authenticate.middleware');
const router = express.Router();

router.get('/report', isAuthenticated, getSalesReport);

module.exports = router;
