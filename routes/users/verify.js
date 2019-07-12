const express = require('express');
const router = express.Router();

// @route   POST api/users/register
// @desc    Login user & return JWT Token
// @access  Public
router.get('/', (req, res) => {
    console.log(req.query);

    res.send('Verify:'+ JSON.stringify(req.query));
})

module.exports = router; 