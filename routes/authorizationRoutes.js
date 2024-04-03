const express = require('express');
const router = express.Router();
const authorizationController = require('../controllers/authorizationController');

router.post('/register', authorizationController.registerUser);
router.post('/login', authorizationController.loginUser)
router.post('/me', authorizationController.me)
router.get('/auth/google', authorizationController.authenticateGoogle)
router.get('/auth/google/callback', authorizationController.authenticateGoogleCb)


module.exports = router;