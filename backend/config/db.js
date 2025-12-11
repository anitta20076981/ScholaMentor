// const mysql = require('mysql2');

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'scholamentor'
// });

// module.exports = db.promise();


const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST,       // MySQL host from Railway
  user: process.env.DB_USER,       // MySQL username from Railway
  password: process.env.DB_PASSWORD, // MySQL password from Railway
  database: process.env.DB_NAME     // Database name from Railway
});

module.exports = db.promise();
