const db = require("../config/db");
const fs = require("fs");
const path = require("path");
 
exports.getRecommendedStudents = async (req, res) => {
  try {
    const query = `
      SELECT 
      sa.*,
      u.name AS student_name,
      u.email AS student_email,
      u.type AS user_type,
      sd.course,
      sd.cgpa AS student_cgpa
      FROM sponsorshipapplications AS sa
      JOIN users AS u ON sa.student_id = u.id
      JOIN studentdetails AS sd ON sd.student_id = u.id
      ORDER BY sd.cgpa DESC
      LIMIT 3

    `;

    const [rows] = await db.execute(query);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No sponsorship requests found" });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recommended students" });
  }
};

 

exports.getStudentRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const query = `
      SELECT 
        sa.*,
        u.id AS user_id,
        u.name AS student_name,
        u.email AS student_email,
        u.type AS user_type,
        sd.id AS student_detail_id,
        sd.course,
        sd.cgpa,
        sd.phone AS phone

        FROM sponsorshipapplications AS sa
        JOIN users AS u ON sa.student_id = u.id
        JOIN studentdetails AS sd ON sd.student_id = u.id
        WHERE sa.id = ?
      `;

    const [rows] = await db.execute(query, [requestId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sponsorship details" });
  }
};


// POST /api/sponsor/request-more-info/:applicationId
// POST /api/sponsor/request-more-info/:requestId/:sponsorId
exports.requestMoreInfo = async (req, res) => {
  const { requestId, sponsorId } = req.params; // get from URL
  const { message, required_document } = req.body;

  try {
    // Get the student_id from the application
    const [apps] = await db.execute(
      'SELECT student_id FROM sponsorshipapplications WHERE id = ?',
      [requestId]
    );

    if (!apps.length) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const studentId = apps[0].student_id;

    // Insert into info_requests
    const insertQuery = `
      INSERT INTO inforequests
      (application_id, sponsor_id, student_id, message, required_document)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(insertQuery, [
      requestId,
      sponsorId,
      studentId,
      message,
      required_document || null
    ]);

    const infoRequestId = result.insertId; // get the newly created info_request id

    // Create notification for the student
   await db.execute(
  `INSERT INTO notifications (user_id, message, type , data, status, created_at, updated_at)
   VALUES (?, ?, ?, ?, 'unread', NOW(), NOW())`,
    [
      studentId,
      message || 'Please upload the required document',
      'info_request', 
      JSON.stringify({ infoRequestId }) 
    ]);

    await db.query(
      `UPDATE sponsorshipapplications
       SET status = 'MoreInfo' 
       WHERE id = ?`,
      [requestId]
    );


    res.json({ success: true, infoRequestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.getNotifications = async (req, res) => {
  const { sponsorId } = req.params;

  try {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = ? AND status = 'unread' AND type ='sponsor_notify'
      ORDER BY created_at DESC LIMIT 5
    `;

    const [rows] = await db.execute(query, [sponsorId]);
 
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

exports.getInfoRequest = async (req, res) => {
  const { requestId, sponsorId } = req.params;
  try {
     const query = `
  SELECT COUNT(*) AS count 
  FROM inforequests
  WHERE application_id = ? AND sponsor_id = ? AND status = 'Pending'
`;
  const [rows] = await db.execute(query, [requestId, sponsorId]);
  const count = rows?.[0]?.count ?? 0;
  res.json(count); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

exports.getSubmittedDocs = async (req, res) => {
  const { requestId, sponsorId } = req.params;
  try {
    const query = `
    SELECT * 
    FROM inforequests
    WHERE application_id = ? AND sponsor_id = ? AND status = 'Submitted' ORDER BY created_at DESC`;

  const [rows] = await db.execute(query, [requestId, sponsorId]);
  res.json(rows); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};






 

