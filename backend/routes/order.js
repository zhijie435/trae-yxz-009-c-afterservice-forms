const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/list', orderController.getOrderList);
router.get('/detail', orderController.getOrderDetail);
router.post('/renewal-status', orderController.updateRenewalStatus);
router.post('/termination-status', orderController.updateTerminationStatus);
router.post('/repair-status', orderController.updateRepairStatus);

module.exports = router;
