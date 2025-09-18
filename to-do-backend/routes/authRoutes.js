// const express = require('express');
// const router = express.Router();

// // Define your routes here
// router.post('/login', (req, res) => {
//   res.send('Login route');
// });

// module.exports = router;


const express = require('express');
const router = express.Router();

// Import controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login existing user
router.post('/login', loginUser);

module.exports = router;
