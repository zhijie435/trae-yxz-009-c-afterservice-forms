const express = require('express');
const router = express.Router();
const terminationController = require('../controllers/terminationController');

router.get('/info', terminationController.getTerminationInfo);
router.post('/submit', terminationController.submitTermination);

module.exports = router;
