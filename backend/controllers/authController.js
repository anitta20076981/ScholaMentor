const db = require("../config/db");
const { User } = require('../models');
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }console.log(user);

        return res.json({ message: "Login successful!",role: user.type ,id:user.id});

    } catch (err) {
        console.log("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// REGISTER 

exports.register = async (req, res) => {
    try {
        const { name, email, password, type } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            type
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                type: newUser.type
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
