const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');
const upload = require('../middleware/upload');

router.get('/info', repairController.getRepairInfo);
router.post('/submit', repairController.submitRepair);
router.post('/upload-image', upload.single('file'), repairController.uploadImage);
router.get('/orders', repairController.getRepairOrderList);
router.get('/order-detail', repairController.getRepairOrderDetail);
router.post('/upload-voucher', repairController.uploadVoucher);
router.post('/callback', repairController.workOrderCallback);
router.post('/accept', repairController.acceptRepair);
router.get('/customer-service', repairController.getCustomerService);
router.post('/contact-service', repairController.contactService);
router.post('/rating', repairController.submitRating);

module.exports = router;
