const express = require('express');
const router = express.Router();
const userNFT = require('../controllers/userNFT');

router.post('/store/user-art', userNFT.storeUserArt)
router.post('/create/collection-theme', userNFT.createCollectionTheme)
router.get('/fetch/collection-theme/:id', userNFT.fetchCollectionTheme)
router.delete('/destroy/user-art/:cid', userNFT.deleteUserArt)

module.exports = router;