const express = require('express');
const { User } = require('../models'); // Import your User model
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const NodeCache = require('node-cache');

const SECRET_KEY = '1234'; // Replace with a secure key
const REFRESH_SECRET_KEY = '12345'; // Replace with a secure key
const tokenCache = new NodeCache({ stdTTL: 60 }); // Cache tokens for 60 seconds

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const accessToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token endpoint
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Issue a new access token
    const accessToken = jwt.sign({ userId: decoded.userId }, SECRET_KEY, { expiresIn: '15m' });
    res.json({ accessToken });
  });
});

// Protected route example
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'You have access to this protected route', user: req.user });
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Check cache
  const cachedUser = tokenCache.get(token);
  if (cachedUser) {
    req.user = cachedUser;
    return next();
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    // Cache the verified token
    tokenCache.set(token, decoded);
    req.user = decoded;
    next();
  });
}

// Signup endpoint
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user in the database
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: newUser.id }, SECRET_KEY, { expiresIn: '1h' });

    // Return success response with the token
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;