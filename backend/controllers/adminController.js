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
    const [results] = await db.query(`SELECT sa.id, sa.status, sa.created_at, sa.scholarship_type, u.name AS student_name
      FROM scholarship_applications sa JOIN users u ON sa.student_id = u.id WHERE sa.deleted_at IS NULL
      ORDER BY 
        CASE 
          WHEN sa.status = 'Pending' THEN 1
          WHEN sa.status = 'Approved' THEN 2
          WHEN sa.status = 'Rejected' THEN 3
          ELSE 4
        END,
        sa.created_at DESC
    `);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getScholarshipApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
 
    const [results] = await db.query(
      `SELECT 
          sa.*, 
          u.name AS student_name,
          u.email AS student_email,
          sf.tuition_fee,
          sf.fee_balance
       FROM scholarship_applications sa
       JOIN users u ON sa.student_id = u.id
       LEFT JOIN student_fees sf 
      ON sa.student_id = sf.student_id
       WHERE sa.id = ?`,
      [applicationId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(results[0]); // return single result
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// exports.approveScholarshipApplication = async (req, res) => {
//   try {
//     const { applicationId } = req.params;
//     const { admin_remarks } = req.body;

//     await db.query(
//       `UPDATE scholarship_applications 
//        SET status = 'Approved', admin_remarks = ? 
//        WHERE id = ?`,
//       [admin_remarks, applicationId]
//     );

//     const [updated] = await db.query(
//       `SELECT * FROM scholarship_applications WHERE id = ?`,
//       [applicationId]
//     );

//     res.json(updated[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to approve application" });
//   }
// };


exports.approveScholarshipApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { admin_remarks, custom_amount } = req.body;

    const [results] = await db.query(
      `SELECT 
         sa.*, 
         u.name AS student_name,
         u.email AS student_email,
         sf.tuition_fee,
         sf.fee_balance,
         sf.scholarship_amount,
         sf.fee_concession_amount
       FROM scholarship_applications sa
       JOIN users u ON sa.student_id = u.id
       LEFT JOIN student_fees sf ON sa.student_id = sf.student_id
       WHERE sa.id = ?`,
      [applicationId]
    );

    if (!results.length) {
      return res.status(404).json({ message: "Application not found" });
    }
    const app = results[0];

    const [settings] = await db.query(
      `SELECT * FROM scholarship_settings WHERE type = ? AND active = 1`,
      [app.scholarship_type]
    );

    if (!settings.length) {
      return res.status(400).json({ message: "Scholarship setting not found" });
    }

    const scholarship = settings[0];

    let finalAmount = 0;
    let concessionAmount = 0;

    if (app.scholarship_type === "Special Scheme") {
      if (!custom_amount || Number(custom_amount) <= 0) {
        return res.status(400).json({
          message: "Custom amount is required for Special Scheme scholarship."
        });
      }
      concessionAmount = Number(custom_amount);
    } else {
      if (scholarship.amount_type === "fixed") {
        concessionAmount = scholarship.amount_value;
      }
      if (scholarship.amount_type === "percentage") {
        concessionAmount = (app.tuition_fee * scholarship.percentage) / 100;
      }
    }
 
    const payableFeeAmount = Number(app.fee_balance) - Number(concessionAmount) ;      
    const totalScholarshipAmount = Number(app.scholarship_amount) +  Number(concessionAmount) ;

    await db.query(
      `UPDATE student_fees 
       SET scholarship_amount = ?, fee_balance = ?, scholarship_amount = ?
       WHERE student_id = ?`,
      [finalAmount, payableFeeAmount, totalScholarshipAmount, app.student_id]
    );

    await db.query(
      `UPDATE scholarship_applications 
      SET status = 'Approved',
      admin_remarks = ? , scholarship_amount = ? 
       WHERE id = ?`,
      [admin_remarks || "", concessionAmount, applicationId]
    );

    const [updated] = await db.query(
      `SELECT * FROM scholarship_applications WHERE id = ?`,
      [applicationId]
    );

    const [scholarshipApplication] = await db.query(
      `SELECT * FROM scholarship_applications WHERE id = ?`,
      [applicationId]
    );

    if(scholarshipApplication[0].status == "Approved")

     await db.query(
      `INSERT INTO notifications (user_id, message, type, status, created_at, updated_at)
       VALUES (?, ?, ?, 'unread', NOW(), NOW())`,
      [
        scholarshipApplication[0].student_id,
        `Your scholarship application has been approved by admin! now you can download your scholarship certificate.`,
        "scholarship"
      ]
    );

    res.json(updated[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve application" });
  }
};

exports.getAllSponsorshipRequest = async (req, res) => {
  try {
    const [results] = await db.query(`SELECT sa.id, sa.status, sa.required_amount, sa.created_at, sa.purpose, u.name AS student_name
      FROM sponsorshipapplications sa JOIN users u ON sa.student_id = u.id WHERE sa.deleted_at IS NULL
      ORDER BY 
        CASE 
          WHEN sa.status = 'Pending' THEN 1
          WHEN sa.status = 'Approved' THEN 2
          WHEN sa.status = 'Rejected' THEN 3
          ELSE 4
        END,
        sa.created_at DESC
    `);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




exports.rejectScholarshipApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { admin_remarks } = req.body;

    await db.query(
      `UPDATE scholarship_applications 
       SET status = 'Rejected', admin_remarks = ? 
       WHERE id = ?`,
      [admin_remarks, applicationId]
    );

    const [updated] = await db.query(
      `SELECT * FROM scholarship_applications WHERE id = ?`,
      [applicationId]
    );

    res.json(updated[0]);

     const [scholarshipApplication] = await db.query(
      `SELECT * FROM scholarship_applications WHERE id = ?`,
      [applicationId]
    );

    if(scholarshipApplication[0].status == "Rejected")

     await db.query(
      `INSERT INTO notifications (user_id, message, type, status, created_at, updated_at)
       VALUES (?, ?, ?, 'unread', NOW(), NOW())`,
      [
        scholarshipApplication[0].student_id,
        `Your scholarship application has been rejected by admin! you are not eligible for this scholarship certificate.`,
        "scholarship"
      ]
    );



  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reject application" });
  }
};

exports.deleteScholarshipApplication = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const [existing] = await db.query(
      "SELECT * FROM scholarship_applications WHERE id = ?",
      [applicationId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Application not found." });
    }

     await db.query(
      "UPDATE scholarship_applications SET deleted_at = NOW() WHERE id = ?",
      [applicationId]
    );


    return res.json({ message: "Application deleted successfully." });

  } catch (err) {
    console.error("Error deleting application:", err);
    return res.status(500).json({ message: "Server error while deleting application." });
  }
};


exports.getAllFeeConcessionpApplications = async (req, res) => {
  try {
    const [results] = await db.query(`SELECT sa.id, sa.status, sa.created_at, sa.course,sa.concession_requested, u.name AS student_name
      FROM fee_concession_applications sa JOIN users u ON sa.student_id = u.id WHERE sa.deleted_at IS NULL
      ORDER BY 
        CASE 
          WHEN sa.status = 'Pending' THEN 1
          WHEN sa.status = 'Approved' THEN 2
          WHEN sa.status = 'Rejected' THEN 3
          ELSE 4
        END,
        sa.created_at DESC
    `);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getFeeConcessionApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

     const [results] = await db.query(
      `SELECT 
          sa.*, 
          u.name AS student_name,
          u.email AS student_email,
          sf.tuition_fee,
          sf.fee_balance
       FROM fee_concession_applications sa
       JOIN users u ON sa.student_id = u.id
       LEFT JOIN student_fees sf 
      ON sa.student_id = sf.student_id
       WHERE sa.id = ?`,
      [applicationId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(results[0]); // return single result
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.approveFeeConcessionApplication = async (req, res) => {
//   try {
//     const { applicationId } = req.params;
//     const { admin_remarks } = req.body;

//     const [results] = await db.query(
//       `SELECT 
//         sa.*, 
//         u.name AS student_name,
//         u.email AS student_email,
//         sf.tuition_fee,
//         sf.fee_balance,
//         sf.scholarship_amount,
//         sf.fee_concession_amount
//         FROM fee_concession_applications sa
//         JOIN users u ON sa.student_id = u.id
//         LEFT JOIN student_fees sf ON sa.student_id = sf.student_id
//         WHERE sa.id = ?`,
//       [applicationId]
//     );

//     const app = results[0];
//     console.log(app);
    
   

//     await db.query(
//       `UPDATE fee_concession_applications 
//        SET status = 'Approved', admin_remarks = ? ,
//        WHERE id = ?`,
//       [admin_remarks, applicationId]
//     );

//     const [updated] = await db.query(
//       `SELECT * FROM fee_concession_applications WHERE id = ?`,
//       [applicationId]
//     );

//     res.json(updated[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to approve application" });
//   }
// };


exports.approveFeeConcessionApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { admin_remarks } = req.body;

    const [results] = await db.query(
      `SELECT 
        sa.*, 
        u.name AS student_name,
        u.email AS student_email,
        sf.tuition_fee,
        sf.fee_balance,
        sf.scholarship_amount,
        sf.fee_concession_amount
      FROM fee_concession_applications sa
      JOIN users u ON sa.student_id = u.id
      LEFT JOIN student_fees sf ON sa.student_id = sf.student_id
      WHERE sa.id = ?`,
      [applicationId]
    );

    if (!results.length) {
      return res.status(404).json({ message: "Application not found" });
    }

    const app = results[0];

    const tuitionFee = Number(app.tuition_fee) || 0;
    const currentPayable = Number(app.fee_balance);

    const concessionPercentage = Number(app.concession_requested) || 0;
    const concessionAmount = (tuitionFee * concessionPercentage) / 100;

    const newFeeBalance = currentPayable - concessionAmount;


    await db.query(
      `UPDATE student_fees
      SET fee_concession_amount = ?, 
          fee_balance = ?
      WHERE student_id = ?`,
      [concessionAmount, newFeeBalance, app.student_id]
    );

    await db.query(
      `UPDATE fee_concession_applications
       SET status = 'Approved', admin_remarks = ?, concession_amount =?
       WHERE id = ?`,
      [admin_remarks || "", concessionAmount , applicationId]
    );

    const [updated] = await db.query(
      `SELECT * FROM fee_concession_applications WHERE id = ?`,
      [applicationId]
    );

    res.json(updated[0]);

     const [feeconcessionApplication] = await db.query(
      `SELECT * FROM fee_concession_applications WHERE id = ?`,
      [applicationId]
    );
    if(feeconcessionApplication[0].status == "Approved")

     await db.query(
      `INSERT INTO notifications (user_id, message, type, status, created_at, updated_at)
       VALUES (?, ?, ?, 'unread', NOW(), NOW())`,
      [
        feeconcessionApplication[0].student_id,
        `Your fee concession application has been approved by admin!!!.`,
        "feeconcession"
      ]
    );


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve application" });
  }
};

exports.rejectFeeConcessioApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { admin_remarks } = req.body;

    await db.query(
      `UPDATE fee_concession_applications 
       SET status = 'Rejected', admin_remarks = ? 
       WHERE id = ?`,
      [admin_remarks, applicationId]
    );

    const [updated] = await db.query(
      `SELECT * FROM fee_concession_applications WHERE id = ?`,
      [applicationId]
    );

    res.json(updated[0]);

    const [feeconcessionApplication] = await db.query(
      `SELECT * FROM fee_concession_applications WHERE id = ?`,
      [applicationId]
    );
    if(feeconcessionApplication[0].status == "Rejected")

     await db.query(
      `INSERT INTO notifications (user_id, message, type, status, created_at, updated_at)
       VALUES (?, ?, ?, 'unread', NOW(), NOW())`,
      [
        feeconcessionApplication[0].student_id,
        `Your fee concession application has been rejected by admin!!!.`,
        "feeconcession"
      ]
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reject application" });
  }
};


exports.getScholarshipSettings = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT * FROM scholarship_settings ORDER BY id ASC`
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching scholarship settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateScholarshipSetting = async (req, res) => {
  const { id } = req.params;
  const { amount_type, amount_value, percentage, description } = req.body;

  try {
    await db.query(
      "UPDATE scholarship_settings SET amount_type = ?, amount_value = ?, percentage = ?, description = ? WHERE id = ?",
      [amount_type, amount_value, percentage, description, id]
    );

    const [updated] = await db.query("SELECT * FROM scholarship_settings WHERE id = ?", [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

 
exports.toggleScholarshipSetting = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE scholarship_settings SET active = NOT active WHERE id = ?",
      [id]
    );

    const [updated] = await db.query("SELECT * FROM scholarship_settings WHERE id = ?", [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getSponsorshipRequestById = async (req, res) => {
  try {
    const { applicationId } = req.params;
 
    const [results] = await db.query(
      `SELECT 
          sa.*, 
          u.name AS student_name,
          u.email AS student_email,
          sf.course,
          sf.school_or_college
       FROM sponsorshipapplications sa
       JOIN users u ON sa.student_id = u.id
       LEFT JOIN studentdetails sf 
      ON sa.student_id = sf.student_id
       WHERE sa.id = ?`,
      [applicationId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(results[0]); // return single result
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveSponsorshipRequest = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { admin_remarks } = req.body;

    const [results] = await db.query(
      `SELECT 
          sa.*, 
          u.name AS student_name,
          u.email AS student_email,
          sf.course,
          sf.school_or_college
       FROM sponsorshipapplications sa
       JOIN users u ON sa.student_id = u.id
       LEFT JOIN studentdetails sf 
      ON sa.student_id = sf.student_id
       WHERE sa.id = ?`,
      [applicationId]
    );

    if (!results.length) {
      return res.status(404).json({ message: "Application not found" });
    }

    const app = results[0];

    await db.query(
      `UPDATE sponsorshipapplications
       SET status = 'Approved', admin_remarks = ? 
       WHERE id = ?`,
      [admin_remarks || "" , applicationId]
    );

     await db.query(
      `INSERT INTO notifications (user_id, message, type, status, created_at, updated_at)
       VALUES (?, ?, ?, 'unread', NOW(), NOW())`,
      [
        app.student_id,
        `Your sponsorship application has been approved by admin! A sponsor will contact you soon.`,
        "sponsorship"
      ]
    );

    const [updated] = await db.query(
      `SELECT * FROM sponsorshipapplications WHERE id = ?`,
      [applicationId]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve application" });
  }
};

exports.rejectSponsorshipRequest = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { admin_remarks } = req.body;

    await db.query(
      `UPDATE sponsorshipapplications 
       SET status = 'Rejected', admin_remarks = ? 
       WHERE id = ?`,
      [admin_remarks, applicationId]
    );

    const [updated] = await db.query(
      `SELECT * FROM sponsorshipapplications WHERE id = ?`,
      [applicationId]
    );

    const app = updated[0];

     await db.query(
      `INSERT INTO notifications (user_id, message, type, status, created_at, updated_at)
       VALUES (?, ?, ?, 'unread', NOW(), NOW())`,
      [
        app.student_id,
        `Your sponsorship application has been rejected by admin!.`,
        "sponsorship"
      ]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reject application" });
  }
};

exports.getAllMentor = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM users WHERE type = 'mentor'");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMentorById = async (req, res) => {
  const { mentorId } = req.params;
  try {
   const query = `
      SELECT u.id, u.name, u.email, u.type, u.status, md.*
      FROM users u
      LEFT JOIN mentordetails md ON md.mentor_id = u.id
      WHERE u.id = ? AND u.type = 'mentor'
    `;

    const [results] = await db.execute(query, [mentorId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json(results[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.approveMentor = async (req, res) => {
  const { mentorId } = req.params;

  try {
    await db.execute(
      "UPDATE users SET status = 'active' WHERE id = ? AND type = 'mentor'",
      [mentorId]
    );

    const query = `
      SELECT u.id, u.name, u.email, u.type, u.status, md.*
      FROM users u
      LEFT JOIN mentordetails md ON md.mentor_id = u.id
      WHERE u.id = ? AND u.type = 'mentor'
    `;

    const [results] = await db.execute(query, [mentorId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json({
      message: "Mentor approved successfully",
      data: results[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllMentorshipRequests = async (req, res) => {
  try {
    const query = `
      SELECT 
        mr.student_id,
        mr.mentor_id,
        mr.status,
        s.name AS student_name,
        u.name AS mentor_name,
        GROUP_CONCAT(msub.name SEPARATOR ', ') AS subjects,
        MIN(mr.created_at) AS request_date
      FROM mentorship_requests AS mr
      JOIN users AS s ON mr.student_id = s.id
      JOIN users AS u ON mr.mentor_id = u.id
      JOIN mentorshipsubjects AS msub ON mr.subject_id = msub.id
      GROUP BY mr.student_id, mr.mentor_id, mr.status, s.name, u.name
      ORDER BY request_date DESC
    `;

    const [rows] = await db.execute(query);
    res.json(rows);

  } catch (err) {
    console.error("Failed to fetch mentorship requests:", err);
    res.status(500).json({ error: "Failed to fetch mentorship requests" });
  }
};


exports.viewMentorshipRequest = async (req, res) => {
  const { studentId, mentorId } = req.params;
 
  const query = `
    SELECT mr.*, s.name AS student_name, u.name AS mentor_name, sub.name AS subject_name
    FROM mentorship_requests mr
    JOIN users s ON mr.student_id = s.id
    JOIN users u ON mr.mentor_id = u.id
    JOIN mentorshipsubjects sub ON mr.subject_id = sub.id
    WHERE mr.student_id = ? AND mr.mentor_id = ?
  `;

  const [rows] = await db.execute(query, [studentId, mentorId]);
 
  res.json(rows);
};

exports.approveMentorshipRequest = async (req, res) => {
  const { studentId, mentorId } = req.params;

  try {
    const query = `
      UPDATE mentorship_requests
      SET status = 'approved'
      WHERE student_id = ? AND mentor_id = ? AND status = 'pending'
    `;
    const [result] = await db.execute(query, [studentId, mentorId]);

    await db.query(
      `INSERT INTO notifications (user_id, message, type, status, created_at, updated_at)
       VALUES (?, ?, ?, 'unread', NOW(), NOW())`,
      [
        studentId,
        `Your mentorship application has been approved by admin!.`,
        "mentorship"
      ]
    );

    res.json({ message: "Mentorship request approved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve mentorship request" });
  }
};
