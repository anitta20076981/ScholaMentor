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


exports.approveScholarshipApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { admin_remarks } = req.body;

    await db.query(
      `UPDATE scholarship_applications 
       SET status = 'Approved', admin_remarks = ? 
       WHERE id = ?`,
      [admin_remarks, applicationId]
    );

    const [updated] = await db.query(
      `SELECT * FROM scholarship_applications WHERE id = ?`,
      [applicationId]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve application" });
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
          u.email AS student_email
       FROM fee_concession_applications sa
       JOIN users u ON sa.student_id = u.id
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

exports.approveFeeConcessionApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { admin_remarks } = req.body;

    await db.query(
      `UPDATE fee_concession_applications 
       SET status = 'Approved', admin_remarks = ? 
       WHERE id = ?`,
      [admin_remarks, applicationId]
    );

    const [updated] = await db.query(
      `SELECT * FROM fee_concession_applications WHERE id = ?`,
      [applicationId]
    );

    res.json(updated[0]);
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
