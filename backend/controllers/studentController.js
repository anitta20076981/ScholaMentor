const db = require("../config/db");

exports.getAllScholarships = (req, res) => {
    res.send("List of all scholarship");
};


exports.applyScholarship = (req, res) => {
    //apply scholarship
};

exports.getStudentDetails = async (req, res) => {
  const { studentId } = req.params;

  try {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.execute(query, [studentId]); 
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
};