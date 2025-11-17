const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/students", adminController.getAllStudents);
router.post("/create-scholarship", adminController.createScholarship);
module.exports = router;
