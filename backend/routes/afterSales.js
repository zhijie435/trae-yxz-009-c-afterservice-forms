const express = require('express');
const router = express.Router();
const afterSalesController = require('../controllers/afterSalesController');
const upload = require('../middleware/upload');

router.get('/list', afterSalesController.getAfterSalesList);
router.get('/detail', afterSalesController.getAfterSalesDetail);
router.post('/create', afterSalesController.createAfterSales);
router.post('/upload-image', upload.single('file'), afterSalesController.uploadImage);
router.post('/upload-voucher', afterSalesController.uploadVoucher);
router.get('/customer-service', afterSalesController.getCustomerService);
router.post('/contact-service', afterSalesController.contactService);
router.post('/rating', afterSalesController.submitRating);
router.get('/types', afterSalesController.getAfterSalesTypes);

module.exports = router;
