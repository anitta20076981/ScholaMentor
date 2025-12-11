// const mysql = require('mysql2');

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'scholamentor'
// });

// module.exports = db.promise();



const mysql = require("mysql2");
// Use Railway environment variables if available, fallback to local for dev
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "MyNewStrongPassword!",
  database: process.env.MYSQLDATABASE || "scholamentor",
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ MySQL connected (POOL)");
    conn.release();
  }
});

module.exports = pool;

