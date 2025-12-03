const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

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
    SELECT u.id AS user_id,u.name,u.email,sd.*,sf.tuition_fee
      FROM users u
      LEFT JOIN studentdetails sd ON u.id = sd.student_id
      LEFT JOIN student_fees sf ON sd.student_id = sf.student_id
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
    tuition_fee
  } = req.body;
  console.log("studentId:", studentId);

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

    const [feeRows] = await db.execute(
      `SELECT * FROM student_fees WHERE student_id = ?`,
      [studentId] 
    );

    if (feeRows.length > 0) {
      const feeRecord = feeRows[0];
      const fee_balance =
        (tuition_fee || feeRecord.tuition_fee) -
        (feeRecord.scholarship_amount || 0) -
        (feeRecord.fee_concession_amount || 0);
        
      await db.execute(
        `UPDATE student_fees
        SET tuition_fee = ?, fee_balance = ?, course = ?, semester = ?
        WHERE id = ?`,
        [
          tuition_fee || feeRecord.tuition_fee,   
          fee_balance,                            
          course || feeRecord.course,             
          year || feeRecord.semester,             
          feeRecord.id                            
        ]
      );
    }

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

exports.getScholarshipCount = async (req, res) => { 
  const { studentId } = req.params;
   try {
    const [result] = await db.query(
      `SELECT COUNT(*) AS totalApplications
      FROM scholarship_applications
      WHERE student_id = ? AND deleted_at IS NULL`,
      [studentId]
    );
    const count = result[0].totalApplications;
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
};

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

exports.trackScholarship = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT id, scholarship_type, created_at, status
       FROM scholarship_applications
       WHERE student_id = ? AND deleted_at IS NULL`,
      [studentId]
    );

    res.json({ applications: rows });
  } catch (error) {
    console.error("Error fetching track status:", error);
    res.status(500).json({ error: "Failed to fetch application data" });
  }
};

exports.getFeeConcession = async (req, res) => {
  const { studentId } = req.params;

  try {
    const query = `
      SELECT * FROM fee_concession_applications 
      WHERE student_id = ? AND deleted_at IS NULL
    `;

    const [rows] = await db.execute(query, [studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Fee concession application not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fee concession details" });
  }
};



exports.applyFeeConcession = async (req, res) => {
  const { studentId } = req.params;

  const {
    family_income,
    reason,
    concession_requested,   
  } = req.body;

  // Uploaded files (if available)
  const supporting_doc = req.files?.supporting_doc?.[0]?.filename || null;

  try {

    const [studentDetails] = await db.execute(
      `SELECT course, year AS semester FROM studentdetails WHERE student_id = ?`,
      [studentId]
    );
    const course = studentDetails[0]?.course || null;
    const semester = studentDetails[0]?.semester || null;

    // Check for existing application
    const [existingApplication] = await db.execute(
      `SELECT * FROM fee_concession_applications WHERE student_id = ?`,
      [studentId]
    );    

    if (existingApplication.length > 0) {

      const current = existingApplication[0];

      // Keep old file if new is not uploaded
      const supporting_doc = marksheet_file || current.supporting_doc;
      const updateQuery = `
        UPDATE fee_concession_applications SET
          family_income = ?, 
          reason = ?, 
          concession_requested = ?,  
          supporting_doc = ?, 
          course = ? ,
          semester = ? 
        WHERE student_id = ?
      `;

      await db.execute(updateQuery, [
        family_income || current.family_income,
        reason || current.reason,
        supporting_doc,
        concession_requested || current.concession_requested,
        course,
        semester,
        studentId,
      ]);

    } else {

      const insertQuery = `
        INSERT INTO fee_concession_applications (
          student_id, family_income,
          reason, supporting_doc, concession_requested, course, semester
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await db.execute(insertQuery, [
        studentId,
        family_income || null,
        reason || null,
        supporting_doc || null,
        concession_requested || null,
        course,
        semester,
      ]);
    }

    res.json({ success: true, message: "Fee concession application submitted successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to submit fee concession application" });
  }
};


exports.downloadCertificate = async (req, res) => {
  try {
    //reference from chatgpt
  const { studentId, applicationId } = req.params;

   const [results] = await db.query(
  `SELECT 
      sa.*, 
      u.name AS student_name,
      u.email AS student_email,
      sf.tuition_fee
    FROM scholarship_applications sa
    JOIN users u ON sa.student_id = u.id
    LEFT JOIN student_fees sf ON sa.student_id = sf.student_id
    WHERE sa.id = ?`,
  [applicationId]
);
    const app = results[0];

    // Fetch student/application data from DB
    const studentName = [app.student_name]; // Replace with DB query
    const scholarshipType =  [app.scholarship_type];
    const course =  [app.course];
    const tution_fee =  [app.tuition_fee];
    const amount = [app.scholarship_amount];
    const reducedFee = [app.tuition_fee] - [app.scholarship_amount];
    const date = new Date().toLocaleDateString("en-GB");

    let html = fs.readFileSync(
      path.join(__dirname, "../templates/certificateTemplate.html"),
      "utf-8"
    );

    html = html.replace("{{name}}", studentName)
               .replace("{{scholarship}}", scholarshipType)
               .replace("{{amount}}", amount)
               .replace("{{date}}", date)
               .replace("{{tution_fee}}", tution_fee)
               .replace("{{reducedFee}}", reducedFee);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", bottom: "40px", left: "40px", right: "40px" },
    });

    await browser.close();

    // Send PDF as download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Scholarship_Certificate_${applicationId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error generating PDF certificate:", error);
    res.status(500).json({ message: "Failed to generate certificate" });
  }
};

exports.downloadFeeConcessionCertificate = async (req, res) => {
  try {
    //reference from chatgpt
  const { studentId, applicationId } = req.params;

  const [results] = await db.query(
    `SELECT 
        sa.*, 
        u.name AS student_name,
        u.email AS student_email,
        sf.tuition_fee
      FROM fee_concession_applications sa
      JOIN users u ON sa.student_id = u.id
      LEFT JOIN student_fees sf ON sa.student_id = sf.student_id
      WHERE sa.id = ?`,
    [applicationId]
  );
    const app = results[0];

    // Fetch student/application data from DB
    const studentName = [app.student_name]; // Replace with DB query
    const scholarshipType =  [app.scholarship_type];
    const course =  [app.course];
    const tuitionFee =  [app.tuition_fee];
    const concessionPercent =  [app.concession_requested];
    const concessionAmount = [app.concession_amount];
    const newPayableFee = [app.tuition_fee] - [app.concession_amount];
    const date = new Date().toLocaleDateString("en-GB");

    let html = fs.readFileSync(
      path.join(__dirname, "../templates/feeConcessionCertificateTemplate.html"),
      "utf-8"
    );

    html = html.replace("{{name}}", studentName)
               .replace("{{scholarship}}", scholarshipType)
               .replace("{{concessionAmount}}", concessionAmount)
               .replace("{{concessionPercent}}", concessionPercent)
               .replace("{{date}}", date)
               .replace("{{tuitionFee}}", tuitionFee)
               .replace("{{newPayableFee}}", newPayableFee);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", bottom: "40px", left: "40px", right: "40px" },
    });

    await browser.close();

    // Send PDF as download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Fee_Concession_Certificate_${applicationId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error generating PDF certificate:", error);
    res.status(500).json({ message: "Failed to generate certificate" });
  }
};

exports.applySponsorship = async (req, res) => {
  const { studentId } = req.params;
  const { purpose, required_amount, cgpa, background } = req.body;
  const marksheet = req.files?.marksheet?.[0]?.filename || null;

  try {
    const [existingApplication] = await db.execute(
      `SELECT * FROM sponsorshipapplications WHERE student_id = ? AND purpose = ?`,
      [studentId, purpose]
    );

    const [alreadyApplied] = await db.execute(
      `SELECT * FROM sponsorshipapplications WHERE student_id = ? AND purpose = ?`,
      [studentId, purpose]
    );
    if (alreadyApplied.length > 0) {
      return res.status(500).json({
          success: false,
          error: "You cannot apply twice for the same purpose."
        });
    }
   

    const [existingScholarship] = await db.execute(
      `SELECT * FROM scholarship_applications WHERE student_id = ?`,
      [studentId]
    );
    const [existingFeeConcession] = await db.execute(
      `SELECT * FROM fee_concession_applications WHERE student_id = ?`,
      [studentId]
    );

    if (cgpa <= 8) {
      return res.status(400).json({
        success: false,
        error:
          "Unfortunately, your CGPA does not meet the eligibility criteria for this sponsorship. Keep up the good work and try again in the future!"
      });
    }

    if (existingScholarship.length > 0 || existingFeeConcession.length > 0) {
      return res.status(400).json({
        success: false,
        error:
          "You have already applied for a scholarship or fee concession, so sponsorship is not allowed."
      });
    }

    if (existingApplication.length > 0) {
      const current = existingApplication[0];
      const marksheetFile = marksheet || current.marksheet;

      const updateQuery = `
        UPDATE sponsorshipapplications SET
          purpose = ?, 
          required_amount = ?, 
          cgpa = ?,  
          background = ?, 
          marksheet = ?
        WHERE student_id = ?
      `;

      await db.execute(updateQuery, [
        purpose || current.purpose,
        required_amount || current.required_amount,
        cgpa || current.cgpa,
        background || current.background,
        marksheetFile,
        studentId
      ]);

      return res.json({
        success: true,
        message: "Sponsorship application updated successfully!"
      });
    }

    const insertQuery = `
      INSERT INTO sponsorshipapplications (
        student_id, purpose, required_amount, cgpa, background, marksheet
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.execute(insertQuery, [
      studentId,
      purpose || null,
      required_amount || null,
      cgpa || null,
      background || null,
      marksheet || null
    ]);

    return res.json({
      success: true,
      message: "Sponsorship application submitted successfully!"
    });
  } catch (err) {
    console.error("Error in applySponsorship:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to submit sponsorship application. Please try again later."
    });
  }
};


exports.getSponsorship = async (req, res) => {
  const { studentId } = req.params;

  try {
    // const query = `
    //   SELECT * FROM sponsorshipapplications 
    //   WHERE student_id = ?  
    // `;

    const query = `
      SELECT * FROM sponsorshipapplications
      WHERE student_id = ?
      ORDER BY id DESC
      LIMIT 1
    `;

    const [rows] = await db.execute(query, [studentId]);
 
    if (rows.length === 0) {
      return res.status(404).json({ error: "Sponsorship request not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sponsorship details" });
  }
};

exports.getNotifications = async (req, res) => {
  const { studentId } = req.params;

  try {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = ? AND status = 'unread'
      ORDER BY created_at DESC
    `;

    const [rows] = await db.execute(query, [studentId]);

    if (rows.length === 0) {
      return res.status(200).json([]);  
    }

    res.json(rows);  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};


exports.notificationMarkAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const updateQuery = `
      UPDATE notifications 
      SET status = 'read' 
      WHERE id = ?
    `;
    const [result] = await db.execute(updateQuery, [notificationId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }
    const selectQuery = `
      SELECT * FROM notifications WHERE id = ?
    `;
    const [rows] = await db.execute(selectQuery, [notificationId]);

    res.json(rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

exports.getInfoRequestNotification = async (req, res) => {
  const { studentId } = req.params;

  try {
    const selectQuery = `
      SELECT * 
      FROM inforequests 
      WHERE student_id = ? AND status = ?
    `;

    const [rows] = await db.execute(selectQuery, [
      studentId,
      'Pending'
    ]);
 
    res.json(rows);  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.uploadInfoRequestDocument = async (req, res) => {
  const { infoRequestId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a document" });
    }

    const documentPath = req.file.filename;

    // Update inforequests table
    await db.execute(
      `UPDATE inforequests
       SET response_document = ?, status = 'submitted'
       WHERE id = ?`,
      [documentPath, infoRequestId]
    );

    // Get application_id, sponsor_id, student_id
    const [reqRows] = await db.execute(
      `SELECT application_id, sponsor_id, student_id 
       FROM inforequests 
       WHERE id = ?`,
      [infoRequestId]
    );

    if (reqRows.length === 0) {
      return res.status(404).json({ error: "Info request not found" });
    }

    const applicationId = reqRows[0].application_id;
    const sponsorId = reqRows[0].sponsor_id;
    const studentId = reqRows[0].student_id;

    // Update sponsorshipapplications status
    await db.execute(
      `UPDATE sponsorshipapplications
       SET status = 'InfoSubmitted'
       WHERE id = ?`,
      [applicationId]
    );

    // Get student name
    const [userRows] = await db.execute(
      `SELECT name FROM users WHERE id = ?`,
      [studentId]
    );

    const studentName = userRows[0].name;

    // Insert notification
    await db.execute(
      `INSERT INTO notifications 
       (user_id, message, type, data, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'unread', NOW(), NOW())`,
      [
        sponsorId,
        `${studentName} submitted the requested document`,
        "sponsor_notify",
        JSON.stringify({ infoRequestId })
      ]
    );

    return res.json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to upload document" });
  }
};



exports.getAllSponsorship = async (req, res) => {
  const { studentId } = req.params;

  try {
    const selectQuery = `
    SELECT * 
    FROM sponsorshipapplications 
    WHERE student_id = ? 
      AND status IN (?, ?)
  `;

  const [rows] = await db.execute(selectQuery, [
    studentId,
    'ApprovedBySponsor',
    'RejectedBySponsor'
  ]);
 
    res.json(rows);  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};


exports.getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const query = `SELECT * FROM sponsorshipapplications WHERE id = ?`;

    db.query(query, [applicationId], (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json({
        success: true,
        application: results[0],
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.requestRemainingAmount = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { applicationId, remainingAmount } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM sponsorshipapplications WHERE id = ?",
      [applicationId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Application not found." });
    }

    const previousEntry = rows[0];

    const insertQuery = `
      INSERT INTO sponsorshipapplications (
        student_id, purpose, required_amount, cgpa, background, marksheet, previous_request_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(insertQuery, [
      previousEntry.student_id, 
      previousEntry.purpose || null,
      remainingAmount || null,
      previousEntry.cgpa || null,
      previousEntry.background || null,
      previousEntry.marksheet || null,
      previousEntry.id || null,

    ]);

    return res.status(200).json({ message: "Remaining amount requested successfully." });
  } catch (err) {
    console.error("Error requesting remaining amount:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
