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

  // Files
  const resume = req.files?.resume ? req.files.resume[0].filename : null;
  const certificates = req.files?.certificates ? req.files.certificates[0].filename : null;
  const id_proof = req.files?.id_proof ? req.files.id_proof[0].filename : null;
 
  try {
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
            skills,
            days_available,
            time_slots,
            resume,
            certificates,
            id_proof,
            mentorId
        ]);

        const subjectsArray = JSON.parse(subjects); 
        await db.execute(`DELETE FROM mentor_subjects WHERE mentor_id = ?`, [mentorId]);
        for (const subjectId of subjectsArray) {
          await db.execute(
            `INSERT INTO mentor_subjects (mentor_id, subject_id) VALUES (?, ?)`,
            [mentorId, subjectId]
          );
        }
     
    res.json({ success: true, message: "Profile updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};

exports.getMentorDetails = async (req, res) => {
  const { mentorId } = req.params;

  try {
    // Fetch mentor main details
    const queryMentor = `
      SELECT m.*, u.name, u.email, u.type, u.status
      FROM mentordetails AS m
      JOIN users AS u ON m.mentor_id = u.id
      WHERE m.mentor_id = ?
    `;
    const [mentorRows] = await db.execute(queryMentor, [mentorId]);
    if (mentorRows.length === 0) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    const mentor = mentorRows[0];

    // Fetch mentor subjects
    const querySubjects = `
      SELECT s.id, s.name
      FROM mentor_subjects AS ms
      JOIN subjects AS s ON ms.subject_id = s.id
      WHERE ms.mentor_id = ?
    `;
    const [subjectRows] = await db.execute(querySubjects, [mentorId]);

    // Convert subjects to array of IDs
    mentor.subjects = subjectRows.map(s => s.id.toString());

    res.json(mentor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch mentor details" });
  }
};


exports.getAllSubjects = async (req, res) => {
  const { mentorId } = req.params;

  try {
     const query = `
      SELECT * FROM mentorshipsubjects 
    `;
    const [rows] = await db.execute(query);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(rows); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
};


