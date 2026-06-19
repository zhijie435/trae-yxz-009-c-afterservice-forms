const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/orders', invoiceController.getInvoiceOrders);
router.get('/titles', invoiceController.getInvoiceTitles);
router.get('/addresses', invoiceController.getAddressList);
router.post('/submit', invoiceController.submitInvoiceApplication);

module.exports = router;
