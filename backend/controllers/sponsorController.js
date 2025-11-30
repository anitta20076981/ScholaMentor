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
      LIMIT 3

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

 

exports.getStudentRequest = async (req, res) => {
  console.log(req.params);
  const { requestId } = req.params;

  try {
    const query = `
      SELECT 
        sa.*,
        u.id AS user_id,
        u.name AS student_name,
        u.email AS student_email,
        u.type AS user_type,
        sd.id AS student_detail_id,
        sd.course,
        sd.cgpa,
        sd.phone AS phone

        FROM sponsorshipapplications AS sa
        JOIN users AS u ON sa.student_id = u.id
        JOIN studentdetails AS sd ON sd.student_id = u.id
        WHERE sa.id = ?
      `;

    const [rows] = await db.execute(query, [requestId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sponsorship details" });
  }
};

 

