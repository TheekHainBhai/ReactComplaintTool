const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Make user admin by email
router.post('/make-admin-by-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { $set: { isAdmin: true } },
            { new: true, runValidators: false }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            message: 'User is now an admin',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Error making user admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Temporary route to make current user admin
router.post('/make-admin', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { isAdmin: true } },
            { new: true, runValidators: false }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User is now an admin', user: { 
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin 
        }});
    } catch (error) {
        console.error('Error making user admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
