const db = require("../config/db");
exports.login = (req, res) => {
  res.send("Login route working!");
};

exports.register = (req, res) => {
  res.send("Register route working!");
};

// exports.login = (req, res) => {
//     const { email, password } = req.body;

//     db.query(
//         "SELECT * FROM users WHERE email = ? AND password = ?",
//         [email, password],
//         (err, results) => {
//             if (err) return res.status(500).send(err);

//             if (results.length === 0) {
//                 return res.status(400).send("Invalid credentials");
//             }

//             const user = results[0];
//             res.send({
//                 message: "Login successful",
//                 userId: user.id,
//                 role: user.role
//             });
//         }
//     );
// };
