const db = require("../config/db");
const bcrypt = require("bcrypt");

// LOGIN 
exports.login = async (req, res) => {
    const { email, password } = req.body;
    // Allow only admin login
    if (email !== "admin@gmail.com") {
        return res.status(403).json({ message: "Admin login only" });
    }
        

    try {
        // Find admin in DB
        const [rows] = await db.promise().query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const admin = rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        return res.json({ message: "Admin login successful!",role: admin.type });

    } catch (err) {
        console.log("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// REGISTER 
exports.register = (req, res) => {
    res.send("Register route working!");
};
