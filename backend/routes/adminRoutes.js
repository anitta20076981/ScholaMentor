const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/students_list", adminController.getAllStudents);
router.post("/create-scholarship", adminController.createScholarship);
router.get("/dashboard-stats", adminController.getDashboardStatus);


module.exports = router;
