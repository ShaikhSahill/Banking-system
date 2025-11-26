const { pool } = require('../config/db');

const User = {
    create: async (username, email, password, role) => {
        const [result] = await pool.query(
            'INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role]
        );
        return result.insertId;
    },

    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT id, username, email, role, createdAt FROM Users WHERE id = ?', [id]);
        return rows[0];
    },

    findAllCustomers: async () => {
        const [rows] = await pool.query('SELECT id, username, email, role, createdAt FROM Users WHERE role = "customer"');
        return rows;
    }
};

module.exports = User;
