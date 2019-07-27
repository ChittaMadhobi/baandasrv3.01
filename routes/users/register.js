
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const confirmEmail = require('../../utils/confirmEmail');
const pwdHashed = require('../../utils/hash');
const dbDebugger = require('debug')('app:db');
const gravatar = require('gravatar');
const User = require('../../models/user');
// App level depndency imports 
const validateRegisterInput = require('../../validation/users/validateRegisterInput');


// @route   POST router/users/register
// @desc    Registration. Sends email confirmation notice.
// @access  Public
router.post('/', async (req, res) => {
    dbDebugger('Inside /routes/users/register');
    // Validate
    let { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        // 400 is Invalid Request 
        res.status(400).json(errors);
        return;
    }
    try { 
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            errors.email = "Email already exist. Please log in."
            return res.status(400).json(errors);
        } 
        const avatargen = gravatar.url(req.body.email, {
            s: '200', //size
            r: 'pg', // Rating ..
            d: 'mm' // Defaults to empty face icon
          });
        // Set up email confirmation parameters
        let confirmationCode = Math.floor(Math.random() * 10000000);
        let date = new Date();
        let confirmBy = date.setDate(date.getDate() + 10);
        // Hash password using utility pwdHashed  
        let hashedpwd = await pwdHashed(req.body.password);
        
        user = new User ({
            name: req.body.name,
            email: req.body.email,
            avatar: avatargen,
            password: hashedpwd,
            confirmCode: confirmationCode,
            confirmBy: confirmBy,
            created_at: Date.now()
        });

        let retSave = await user.save();
        dbDebugger('Post registration save state:' + JSON.stringify(retSave));
        // send email for verification
        let retEmail = confirmEmail(req, confirmationCode);
        if (retEmail) {
            res.status(200).json({message:'Registerd successfully. Please confirm your email to register.'});
            // errors = {};
            // res.status(200).send(); 
        } else {
            res.status(500).json(errors); 
        }
        // res.status(200).send(_.pick(user, ['name', 'email', 'avatar']));
    } catch(err) {
        dbDebugger('Failed to create new user :', err);
        return res.status(401).send('Something went wrong - failed:', err);
    }
})



module.exports = router; 