const express = require('express');
const router = express.Router();

// @route   POST api/users/register
// @desc    Login user & return JWT Token
// @access  Public
router.post('/', (req, res) => {
    console.log(req.body);

    res.send('Login Body:'+ JSON.stringify(req.body));
})

module.exports = router; 