const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
require('dotenv').config()

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username: username, password: hashedPassword });
        await newUser.save();

        const payload = {
            user: {
                userId: newUser._id,
                username: newUser.username
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET || 'SECRET', { expiresIn: 3600 }, async (err, token) => {
            if (err) throw err;
            await User.updateOne({ _id: newUser._id }, {
                $set: { token }
            })
            newUser.save();
            return res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: newUser._id,
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const payload = {
            user: {
                userId: user._id,
                username: user.username
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET || 'SECRET', { expiresIn: 3600 }, async (err, token) => {
            if (err) throw err;
            await User.updateOne({ _id: user._id }, {
                $set: { token }
            })
            user.save();
            return res.cookie('token', token, { sameSite: 'none', secure: true }).json({
                id: user._id,
            });
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', { sameSite: 'none', secure: true }).json('ok');
});

module.exports = router;