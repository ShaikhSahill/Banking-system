const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const AuthController = {
    register: async (req, res) => {
        try {
            const { username, email, password, role } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await User.create(username, email, hashedPassword, role || 'customer');

            res.status(201).json({ message: 'User registered successfully', userId });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = generateToken(user);
            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, username: user.username, email: user.email, role: user.role }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
};

module.exports = AuthController;
