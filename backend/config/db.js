const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

const connectDB = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('MySQL Connected Successfully');
    connection.release();
  } catch (error) {
    console.error('MySQL Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = { pool: promisePool, connectDB };
