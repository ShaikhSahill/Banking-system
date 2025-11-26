const { pool } = require('../config/db');

const Account = {
    getBalance: async (userId) => {
        const [rows] = await pool.query(
            'SELECT balance_after FROM Accounts WHERE user_id = ? ORDER BY account_id DESC LIMIT 1',
            [userId]
        );
        return rows.length > 0 ? parseFloat(rows[0].balance_after) : 0.00;
    },

    createTransaction: async (userId, type, amount) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Get current balance
            const [rows] = await connection.query(
                'SELECT balance_after FROM Accounts WHERE user_id = ? ORDER BY account_id DESC LIMIT 1',
                [userId]
            );
            const currentBalance = rows.length > 0 ? parseFloat(rows[0].balance_after) : 0.00;
            const amountFloat = parseFloat(amount);

            let newBalance = currentBalance;
            if (type === 'deposit') {
                newBalance += amountFloat;
            } else if (type === 'withdraw') {
                if (currentBalance < amountFloat) {
                    throw new Error('Insufficient funds');
                }
                newBalance -= amountFloat;
            }

            const [result] = await connection.query(
                'INSERT INTO Accounts (user_id, transaction_type, amount, balance_after) VALUES (?, ?, ?, ?)',
                [userId, type, amountFloat, newBalance]
            );

            await connection.commit();
            return { id: result.insertId, balance: newBalance, type, amount: amountFloat };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    getTransactions: async (userId) => {
        const [rows] = await pool.query(
            'SELECT * FROM Accounts WHERE user_id = ? ORDER BY createdAt DESC',
            [userId]
        );
        return rows;
    }
};

module.exports = Account;
