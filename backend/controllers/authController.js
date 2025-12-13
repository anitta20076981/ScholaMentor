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

       const [result] = await db.query(
        "SELECT COUNT(*) AS total FROM scholarship_applications WHERE student_id = ?",
        [user.id]
        );
        const userScholarshipApplicationCount = result[0].total;

         

        return res.json({
            message: "Login successful!",
            role: user.type,
            id: user.id,
            userScholarshipApplicationCount :userScholarshipApplicationCount
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

        let status = 'active';
        if (type === 'mentor' || type ==='sponsor') {
            status = 'inactive'; // by default mentor is inactive 
        }else{
            status = 'active';
        }

        const createdAt = new Date();
        const updatedAt = new Date();


        const [result] = await db.query(
            "INSERT INTO users (name, email, password, type ,status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, email, hashedPassword, type, status, createdAt, updatedAt]
        );

        const userId = result.insertId;
        // If type is student, create entry in student_details table
        if (type === "student") {
            // await db.query(
            //     `INSERT INTO studentdetails (student_id) VALUES (?)`,
            //     [userId]
            // );
            await db.query(
                `INSERT INTO studentdetails 
                (student_id, family_income, cgpa, dob)
                VALUES (?, 0, 0.00, NULL)`,
                [userId]
            );
             await db.query(
                `INSERT INTO student_fees (student_id) VALUES (?)`,
                [userId]
            );
        }
        if (type === "mentor") {
            await db.query(
                `INSERT INTO mentordetails (mentor_id) VALUES (?)`,
                [userId]
            );
        }
        if (type === "sponsor") {
            await db.query(
                `INSERT INTO sponsor_details (sponsor_id) VALUES (?)`,
                [userId]
            );
        }

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
