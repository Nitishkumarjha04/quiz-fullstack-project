const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");

router.post("/register", async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        const existingUser =
        await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword =
        await bcrypt.hash(password, 10);

        const user = new User({

            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            success: true,
            message: "User Registered"
        });

    } catch (err) {

        res.status(500).json(err);
    }
});

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
        await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Invalid Email"
            });
        }

        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(

            {
                id: user._id
            },

            "quiz_secret_key",

            {
                expiresIn: "7d"
            }
        );

        res.json({

            success: true,

            token,

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {

        res.status(500).json(err);
    }
});

module.exports = router;