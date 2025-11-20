const db = require("../config/db");
const bcrypt = require("bcrypt");

//  LOGIN 
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query(
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
        }

        return res.json({
            message: "Login successful!",
            role: user.type,
            id: user.id
        });

    } catch (err) {
        console.log("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// REGISTER 
exports.register = async (req, res) => {
    try {
        const { name, email, password, type } = req.body;
        const [existing] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, type]
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: result.insertId,
                name,
                email,
                type
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
