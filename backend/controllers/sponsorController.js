const db = require("../config/db");
const fs = require("fs");
const path = require("path");
 
exports.getRecommendedStudents = async (req, res) => {
  try {
    const query = `
      SELECT 
      sa.*,
      u.name AS student_name,
      u.email AS student_email,
      u.type AS user_type,
      sd.course,
      sd.cgpa AS student_cgpa
      FROM sponsorshipapplications AS sa
      JOIN users AS u ON sa.student_id = u.id
      JOIN studentdetails AS sd ON sd.student_id = u.id
      ORDER BY sd.cgpa DESC
    `;

    const [rows] = await db.execute(query);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No sponsorship requests found" });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recommended students" });
  }
};

 

