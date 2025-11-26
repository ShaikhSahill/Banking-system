const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/deposit', TransactionController.deposit);
router.post('/withdraw', TransactionController.withdraw);
router.get('/history', TransactionController.getHistory);

module.exports = router;
