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
     const query = `
      SELECT u.id AS user_id, u.name, u.email, sd.*
      FROM users u
      LEFT JOIN studentdetails sd ON u.id = sd.student_id
      WHERE u.id = ?
    `;
    // const query = "SELECT * FROM users WHERE id = ?";
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

exports.updateStudentDetails = async (req, res) => {
  const { studentId } = req.params;

  console.log("Student ID:", studentId);
  console.log("Request body:", req.body);
  console.log("Uploaded files:", req.files);

  const {
    fullName,
    email,
    phone,
    dob,
    gender,
    address,
    pincode,
    school_or_college,
    course,
    department,
    year,
    cgpa,
    family_income,
  } = req.body;

  // Files
  const profile_photo = req.files?.profile_photo ? req.files.profile_photo[0].filename : null;
  const id_proof = req.files?.id_proof ? req.files.id_proof[0].filename : null;
  const address_proof = req.files?.address_proof ? req.files.address_proof[0].filename : null;
  const marksheet = req.files?.marksheet ? req.files.marksheet[0].filename : null;
  const income_proof = req.files?.income_proof ? req.files.income_proof[0].filename : null;

  try {
    // Update users table (name and email only)
    await db.execute(
      `UPDATE users SET name = ?, email = ? WHERE id = ?`,
      [fullName, email, studentId]
    );

    //  Update student_details table
    const query = `
      UPDATE studentdetails
      SET phone = ?, dob = ?, gender = ?, address = ?, pincode = ?, 
          school_or_college = ?, course = ?, department = ?, year = ?, cgpa = ?, family_income = ?,
          profile_photo = COALESCE(?, profile_photo),
          id_proof = COALESCE(?, id_proof),
          address_proof = COALESCE(?, address_proof),
          marksheet = COALESCE(?, marksheet),
          income_proof = COALESCE(?, income_proof)
      WHERE student_id = ?
    `;

    await db.execute(query, [
      phone,
      dob,
      gender,
      address,
      pincode,
      school_or_college,
      course,
      department,
      year,
      cgpa,
      family_income,
      profile_photo,
      id_proof,
      address_proof,
      marksheet,
      income_proof,
      studentId,
    ]);

    res.json({ success: true, message: "Profile updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};


// exports.updateStudentDetails = async (req, res) => {
//   console.log(876543);
//   const { studentId } = req.params;
//   try {
//     console.log("Student ID:", studentId);
//         console.log("Params studentId:", studentId);

//     console.log("Request body:", req.body);
//     console.log("Request files:", req.files);
//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch student details" });
//   }
// };