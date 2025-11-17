const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
router.post("/login", authController.login);    // admin, student , sposor, mentor and donar have 
router.post("/register", authController.register); // POST /api/auth/register
module.exports = router;