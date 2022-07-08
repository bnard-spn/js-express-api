const express = require('express');
const {
    register,
    getToken
} = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.get('/token', getToken);

module.exports = router;