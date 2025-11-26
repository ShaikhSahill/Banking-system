# Banking System

A full-stack banking application built with React, Node.js, Express, and MySQL.

## Prerequisites

- Node.js installed
- MySQL installed and running

## Setup

### Database

1. Create a MySQL database named `Bank` (or update `.env` with your DB name).
2. The backend will automatically create the tables (`Users`, `Accounts`) if they don't exist when you run the setup script.

### Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Open `.env` file.
   - Update `DB_USER` and `DB_PASS` with your MySQL credentials.
4. Initialize the database:
   ```bash
   node utils/dbSetup.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5173`.

## Features

- **Customer**: Login, View Balance, Deposit, Withdraw, View Transaction History.
- **Banker**: Login, View All Customers, View Customer Transactions.

## Default Users

You can register new users via the API (Postman) or insert them into the database.
To create a banker, you can manually update the `role` to 'banker' in the database or use the registration API with `role: 'banker'`.

API Endpoint to register: `POST http://localhost:5000/api/auth/register`
Body:
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer" // or "banker"
}
```
