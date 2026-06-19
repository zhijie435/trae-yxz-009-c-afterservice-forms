const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');

router.get('/info', repairController.getRepairInfo);
router.post('/submit', repairController.submitRepair);

module.exports = router;
