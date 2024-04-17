const express = require('express');
const router = express.Router(); 
const jwt = require('jsonwebtoken');
const Message = require('../models/Message') 
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET;

const getUserDataFromRequest = async (req) => {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                resolve(userData);
            });
        } else {
            reject('no token');
        }
    });
}

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.user.userId;
    const messages = await Message.find({
        sender: { $in: [userId, ourUserId] },
        recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 }); 
    res.json(messages);
});

module.exports = router;