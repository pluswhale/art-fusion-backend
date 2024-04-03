const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/user/:userId/items', userController.getUserItems);
router.get('/users', userController.getUsers)

module.exports = router;