const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const setupDatabase = async () => {
    try {
        // Connect without database selected
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`Database ${process.env.DB_NAME} created or already exists.`);

        await connection.changeUser({ database: process.env.DB_NAME });

        // Create Users table
        const createUsersTable = `
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'banker') NOT NULL DEFAULT 'customer',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        await connection.query(createUsersTable);
        console.log('Users table checked/created.');

        // Create Accounts table
        const createAccountsTable = `
      CREATE TABLE IF NOT EXISTS Accounts (
        account_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        transaction_type ENUM('deposit', 'withdraw') NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        balance_after DECIMAL(10,2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `;
        await connection.query(createAccountsTable);
        console.log('Accounts table checked/created.');

        await connection.end();
        console.log('Database setup complete.');
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    }
};

setupDatabase();
