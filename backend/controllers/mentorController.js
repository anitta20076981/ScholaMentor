const db = require("../config/db");
 

exports.updateMentorDetails = async (req, res) => {
  const { mentorId } = req.params;

  const {
    phone_number,
    address,
    gender,
    
    current_job_title,
    company,
    years_of_experience,
    industry,
    short_bio,
    linkedin_profile,
    subjects,
    skills,
    days_available,
    time_slots
  } = req.body;
  console.log("mentorId:", mentorId);

  // Files
  const resume = req.files?.resume ? req.files.resume[0].filename : null;
  const certificates = req.files?.certificates ? req.files.certificates[0].filename : null;
  const id_proof = req.files?.id_proof ? req.files.id_proof[0].filename : null;
 
  try {
    // Update users table (name and email only)
    // await db.execute(
    //   `UPDATE users SET name = ?, email = ? WHERE id = ?`,
    //   [fullName, email, studentId]
    // );

    //  Update student_details table
    const query = `
    UPDATE mentordetails
    SET 
       
        phone_number = ?,
        address = ?,
        gender = ?,
        current_job_title = ?,
        company = ?,
        years_of_experience = ?,
        industry = ?,
        short_bio = ?,
        linkedin_profile = ?,
        subjects = ?,
        skills = ?,
        days_available = ?,
        time_slots = ?,
        resume = COALESCE(?, resume),
        certificates = COALESCE(?, certificates),
        id_proof = COALESCE(?, id_proof)
        WHERE mentor_id = ?`;

        await db.execute(query, [
            phone_number,
            address,
            gender,
            current_job_title,
            company,
            years_of_experience,
            industry,
            short_bio,
            linkedin_profile,
            subjects,
            skills,
            days_available,
            time_slots,
            resume,
            certificates,
            id_proof,
            mentorId
        ]);

    res.json({ success: true, message: "Profile updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};

exports.getMentorDetails = async (req, res) => {
  const { mentorId } = req.params;

  try {
     const query = `
      SELECT m.*, u.name,u.email,u.type,u.status   
      FROM mentordetails AS m JOIN users AS u ON m.mentor_id = u.id
      WHERE m.mentor_id = ?
    `;
     const [rows] = await db.execute(query, [mentorId]); 
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
};


