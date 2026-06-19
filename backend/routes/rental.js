const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

router.get('/durations', rentalController.getRentalDurations);
router.post('/calculate', rentalController.calculateRentalFee);
router.post('/submit', rentalController.submitPayment);
router.post('/confirm', rentalController.confirmRenewalPayment);

module.exports = router;
