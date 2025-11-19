const db = require("../config/db");
exports.getAllStudents = (req, res) => {
   const query ="SELECT * FROM users WHERE type = 'student'";


  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });
};

exports.login = (req, res) => {
    res.send("Admin login");
};

exports.createScholarship = (req, res) => {
    res.send("Scholarship created");
};


