const Account = require('../models/accountModel');

const TransactionController = {
    deposit: async (req, res) => {
        try {
            const { amount } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({ message: 'Invalid amount' });
            }

            const result = await Account.createTransaction(req.user.id, 'deposit', amount);
            res.json({ message: 'Deposit successful', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },

    withdraw: async (req, res) => {
        try {
            const { amount } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({ message: 'Invalid amount' });
            }

            const result = await Account.createTransaction(req.user.id, 'withdraw', amount);
            res.json({ message: 'Withdrawal successful', data: result });
        } catch (error) {
            if (error.message === 'Insufficient funds') {
                return res.status(400).json({ message: 'Insufficient funds' });
            }
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },

    getHistory: async (req, res) => {
        try {
            const transactions = await Account.getTransactions(req.user.id);
            const balance = await Account.getBalance(req.user.id);
            res.json({ balance, transactions });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
};

module.exports = TransactionController;
