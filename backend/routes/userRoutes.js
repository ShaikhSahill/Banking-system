const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { verifyBanker } = require('../middleware/authMiddleware');

router.use(verifyBanker);

router.get('/customers', UserController.getAllCustomers);
router.get('/customers/:userId/transactions', UserController.getCustomerTransactions);

module.exports = router;
