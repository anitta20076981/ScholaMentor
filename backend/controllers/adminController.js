const db = require("../config/db");
exports.getAllStudents = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM users WHERE type = 'student'");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = (req, res) => {
    res.send("Admin login");
};

exports.createScholarship = (req, res) => {
    res.send("Scholarship created");
};

exports.getDashboardStatus = async (req, res) => {
  try {
    // Pending, Approved, and Rejected counts for scholarship applications
    const [scholarshipData] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pendingScholarship,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approvedScholarship,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejectedScholarship
      FROM scholarship_applications
    `);

    // Pending, Approved, and Rejected counts for fee concession applications
    const [feeConcessionData] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pendingFeeConcession,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approvedFeeConcession,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejectedFeeConcession
      FROM fee_concession_applications
    `);

    res.json({
      pendingScholarship: scholarshipData[0].pendingScholarship,
      approvedScholarship: scholarshipData[0].approvedScholarship,
      rejectedScholarship: scholarshipData[0].rejectedScholarship,
      pendingFeeConcession: feeConcessionData[0].pendingFeeConcession,
      approvedFeeConcession: feeConcessionData[0].approvedFeeConcession,
      rejectedFeeConcession: feeConcessionData[0].rejectedFeeConcession
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllScholarshipApplications = async (req, res) => {
  try {
    const [results] = await db.query(`SELECT sa.id, sa.status, sa.created_at, u.name AS student_name
                                    FROM scholarship_applications sa JOIN users u ON sa.user_id = u.id`);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




