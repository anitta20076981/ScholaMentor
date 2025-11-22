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

exports.getScholarship = async (req, res) => {
  const { studentId, type } = req.params;

  try {
    const query = `
      SELECT * FROM scholarship_applications 
      WHERE student_id = ? AND scholarship_type = ?
    `;

    const [rows] = await db.execute(query, [studentId, type]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Scholarship application not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch scholarship details" });
  }
};


// exports.applyScholarshipByType = async (req, res) => {
//   const { studentId, type } = req.params;   
//   const {
//     academic_percentage,
//     attendance_percentage,
//     merit_reason,
//     family_income,
//     father_occupation,
//     mother_occupation,
//     dependents,
//     need_reason,
//     sport_name,
//     level,
//     team_or_individual,
//     coach_name,
//     coach_contact,
//     sports_reason,
//     category_type,
//     scheme_reason,
//   } = req.body;

//   // Files
//   const marksheet_file = req.files?.marksheet_file ? req.files.marksheet_file[0].filename : null;
//   const income_certificate = req.files?.income_certificate ? req.files.income_certificate[0].filename : null;
//   const sports_certificate = req.files?.sports_certificate ? req.files.sports_certificate[0].filename : null;
//   const category_certificate = req.files?.category_certificate ? req.files.category_certificate[0].filename : null;
//   const disability_certificate = req.files?.disability_certificate ? req.files.disability_certificate[0].filename : null;
// console.log(marksheet_file);
//   try {
//     const [existingApplication] = await db.execute(
//       `SELECT * FROM scholarship_applications WHERE student_id = ? AND scholarship_type = ?`,
//       [studentId, type]
//     );

//     if (existingApplication.length > 0) {
//       // Entry exists: update scholarship application
//       const updateQuery = `
//     UPDATE scholarship_applications
//       SET academic_percentage = ?, attendance_percentage = ?, marksheet_file = ?,  merit_reason = ?, family_income = ?, father_occupation = ?,
//       mother_occupation = ?,dependents = ?, need_reason = ?, sport_name = ?,level = ?,team_or_individual = ?,coach_name = ?, coach_contact= ?, sports_reason = ?, category_type = ?, scheme_reason = ?,income_certificate = ?,sports_certificate = ?, category_certificate = ?, disability_certificate = ? WHERE student_id = ? AND scholarship_type = ?
//     `;

//     await db.execute(updateQuery, [
//       academic_percentage ?? null,
//       attendance_percentage ?? null,
//       marksheet_file ?? null,
//       merit_reason ?? null,
//       family_income ?? null,
//       father_occupation ?? null,
//       mother_occupation ?? null,
//       dependents ?? null,
//       need_reason ?? null,
//       sport_name ?? null,
//       level ?? null,
//       team_or_individual ?? null,
//       coach_name ?? null,
//       coach_contact ?? null,
//       sports_reason ?? null,
//       category_type ?? null,
//       scheme_reason ?? null,
//       income_certificate ?? null,
//       sports_certificate ?? null,
//       category_certificate ?? null,
//       disability_certificate ?? null,
//       studentId,         
//       type                
//     ]);

//     } else {
//       // Entry does not exist :create new scholarship application
//     const insertQuery = `
//       INSERT INTO scholarship_applications (
//         student_id, scholarship_type,academic_percentage,attendance_percentage,marksheet_file,merit_reason,       
//         family_income,father_occupation,mother_occupation,dependents,need_reason,sport_name,level,
//         team_or_individual,coach_name, coach_contact,sports_reason,category_type,scheme_reason,income_certificate,
//         sports_certificate,category_certificate,disability_certificate
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//       await db.execute(insertQuery, [
//         studentId,  type,
//         academic_percentage ?? null,
//         attendance_percentage ?? null,
//         marksheet_file ?? null,
//         merit_reason ?? null,

//         family_income ?? null,
//         father_occupation ?? null,
//         mother_occupation ?? null,
//         dependents ?? null,
//         need_reason ?? null,

//         sport_name ?? null,
//         level ?? null,
//         team_or_individual ?? null,
//         coach_name ?? null,
//         coach_contact ?? null,
//         sports_reason ?? null,

//         category_type ?? null,
//         scheme_reason ?? null,

//         income_certificate ?? null,
//         sports_certificate ?? null,
//         category_certificate ?? null,
//         disability_certificate ?? null
//       ]);

//     }

//     res.json({ success: true, message: "Scholarship application submitted successfully!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: "Failed to submit scholarship application" });
//   }
// };


exports.applyScholarshipByType = async (req, res) => {
  const { studentId, type } = req.params;

  const {
    academic_percentage,
    attendance_percentage,
    merit_reason,
    family_income,
    father_occupation,
    mother_occupation,
    dependents,
    need_reason,
    sport_name,
    level,
    team_or_individual,
    coach_name,
    coach_contact,
    sports_reason,
    category_type,
    scheme_reason,
  } = req.body;

  // Uploaded files (if available)
  const marksheet_file = req.files?.marksheet_file?.[0]?.filename || null;
  const income_certificate = req.files?.income_certificate?.[0]?.filename || null;
  const sports_certificate = req.files?.sports_certificate?.[0]?.filename || null;
  const category_certificate = req.files?.category_certificate?.[0]?.filename || null;
  const disability_certificate = req.files?.disability_certificate?.[0]?.filename || null;

  try {

    const [studentDetails] = await db.execute(
      `SELECT course, year AS semester FROM studentdetails WHERE student_id = ?`,
      [studentId]
    );
    const course = studentDetails[0]?.course || null;
    const semester = studentDetails[0]?.semester || null;

    // Check for existing application
    const [existingApplication] = await db.execute(
      `SELECT * FROM scholarship_applications WHERE student_id = ? AND scholarship_type = ?`,
      [studentId, type]
    );    

    if (existingApplication.length > 0) {

      const current = existingApplication[0];

      // Keep old file if new is not uploaded
      const final_marksheet = marksheet_file || current.marksheet_file;
      const final_income_certificate = income_certificate || current.income_certificate;
      const final_sports_certificate = sports_certificate || current.sports_certificate;
      const final_category_certificate = category_certificate || current.category_certificate;
      const final_disability_certificate = disability_certificate || current.disability_certificate;

      const updateQuery = `
        UPDATE scholarship_applications SET
          academic_percentage = ?, 
          attendance_percentage = ?, 
          marksheet_file = ?,  
          merit_reason = ?, 
          family_income = ?, 
          father_occupation = ?,
          mother_occupation = ?,
          dependents = ?,
          need_reason = ?,
          sport_name = ?,
          level = ?,
          team_or_individual = ?,
          coach_name = ?,
          coach_contact = ?,
          sports_reason = ?,
          category_type = ?,
          scheme_reason = ?,
          income_certificate = ?,
          sports_certificate = ?,
          category_certificate = ?,
          disability_certificate = ?,
          course = ? ,
          semester = ? 
        WHERE student_id = ? AND scholarship_type = ?
      `;

      await db.execute(updateQuery, [
        academic_percentage || current.academic_percentage,
        attendance_percentage || current.attendance_percentage,
        final_marksheet,
        merit_reason || current.merit_reason,
        family_income || current.family_income,
        father_occupation || current.father_occupation,
        mother_occupation || current.mother_occupation,
        dependents || current.dependents,
        need_reason || current.need_reason,
        sport_name || current.sport_name,
        level || current.level,
        team_or_individual || current.team_or_individual,
        coach_name || current.coach_name,
        coach_contact || current.coach_contact,
        sports_reason || current.sports_reason,
        category_type || current.category_type,
        scheme_reason || current.scheme_reason,
        final_income_certificate,
        final_sports_certificate,
        final_category_certificate,
        final_disability_certificate,
        course,
        semester,
        studentId,
        type
      ]);

    } else {

      const insertQuery = `
        INSERT INTO scholarship_applications (
          student_id, scholarship_type,
          academic_percentage, attendance_percentage, marksheet_file, merit_reason,
          family_income, father_occupation, mother_occupation, dependents, need_reason,
          sport_name, level, team_or_individual, coach_name, coach_contact, sports_reason,
          category_type, scheme_reason, income_certificate, sports_certificate,
          category_certificate, disability_certificate, course, semester
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await db.execute(insertQuery, [
        studentId,
        type,
        academic_percentage || null,
        attendance_percentage || null,
        marksheet_file || null,
        merit_reason || null,
        family_income || null,
        father_occupation || null,
        mother_occupation || null,
        dependents || null,
        need_reason || null,
        sport_name || null,
        level || null,
        team_or_individual || null,
        coach_name || null,
        coach_contact || null,
        sports_reason || null,
        category_type || null,
        scheme_reason || null,
        income_certificate || null,
        sports_certificate || null,
        category_certificate || null,
        disability_certificate || null,
        course,
        semester,
      ]);
    }

    res.json({ success: true, message: "Scholarship application submitted successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to submit scholarship application" });
  }
};

