const User = require('../models/userModel');
const Account = require('../models/accountModel');

const UserController = {
    getAllCustomers: async (req, res) => {
        try {
            const customers = await User.findAllCustomers();
            // Optionally fetch balance for each customer
            const customersWithBalance = await Promise.all(customers.map(async (customer) => {
                const balance = await Account.getBalance(customer.id);
                return { ...customer, balance };
            }));
            res.json(customersWithBalance);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },

    getCustomerTransactions: async (req, res) => {
        try {
            const { userId } = req.params;
            const transactions = await Account.getTransactions(userId);
            const balance = await Account.getBalance(userId);
            res.json({ balance, transactions });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
};

module.exports = UserController;
