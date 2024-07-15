const { User, Blacklist } = require("../users/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const salt = 10;
    const hashPass = await bcrypt.hash(password, salt);
    const usernameExists = await User.findOne({ where: { email: req.body.username } });
    const emailExists = await User.findOne({ where: { email: req.body.email } });

    if (!username || !email || !password ) {
        return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    if (usernameExists) {
        return res.status(400).json({ error: 'Username already exists.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (emailExists) {
        return res.status(400).json({ error: 'Email already exists.' });
    }
    
    try {
        await User.create({
            username: username,
            email: email,
            password: hashPass
        })
        res.status(200).json({ message:`Sign Up untuk username=${username} berhasil dilakukan.`});
    } catch (error) {
        res.status(500).json({
            message:"Internal server error.",
            details: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        // First try to find the user by username
        let user = await User.findOne({
            where: { username: req.body.username }
        });
 
        // If user is not found by username, try to find by email
        if (!user) {
            user = await User.findOne({
                where: { email: req.body.username }
            });
        }

        // If user is still not found, return an error
        if (!user) {
            return res.status(400).json({
                message: "User tidak ditemukan."
            });
        }

        // Compare the provided password with the stored hash
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({
                message: "Password salah."
            });
        }

        // If password matches, generate access and refresh tokens
        const id = user.id;
        const username = user.username;
        const email = user.email;
        const role = user.role;
        const created_at = user.created_at;

        const token = jwt.sign(
            {
                id,
                username,
                email,
                role,
                created_at
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        // Respond with the tokens and user information
        res.status(200).json({
            messagge: "Login berhasil dilakukan.",
            loginResult: {
                id,
                username,
                email,
                role,
                created_at,
                token
            }
        });

    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({
            error: true,
            message: 'Internal server error.',
            details: error.message
        });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if(!token){
            return res.status(401).json({
                message: 'Token diperlukan'
            })
        }
        const checkIfBlacklisted = await Blacklist.findOne({where: { token: token }}); // Check if that token is blacklisted
        // if true, send a no content response.
        if (checkIfBlacklisted) return res.sendStatus(204);
        // otherwise blacklist token
        const newBlacklist = new Blacklist({
            token: token,
        });
        await newBlacklist.save();
        // Also clear request cookie on client
        res.setHeader('Clear-Site-Data', '"cookies"');
        res.status(200).json({ message: 'You are logged out!' });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            details: err.message
        });
    }
};

module.exports = {signup, login, logout};