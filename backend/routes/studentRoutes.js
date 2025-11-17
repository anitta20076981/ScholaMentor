const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/scholarships", studentController.getAllScholarships);
router.post("/apply", studentController.applyScholarship);

module.exports = router;
