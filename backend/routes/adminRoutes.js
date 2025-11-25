const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/students_list", adminController.getAllStudents);
router.post("/create-scholarship", adminController.createScholarship);
router.get("/dashboard-stats", adminController.getDashboardStatus);
router.get("/get-all-scholarshp-applications", adminController.getAllScholarshipApplications);
router.get("/get-scholarship-application/:applicationId", adminController.getScholarshipApplicationById);

router.post("/scholarship-application/:applicationId/approve",adminController.approveScholarshipApplication);
router.post("/scholarship-application/:applicationId/reject",adminController.rejectScholarshipApplication);
router.post("/delete-scholarship-application/:applicationId",adminController.deleteScholarshipApplication);

router.get("/get-all-fee-concession-applications", adminController.getAllFeeConcessionpApplications);
router.get("/get-fee-concession-application/:applicationId", adminController.getFeeConcessionApplicationById);
router.post("/fee-concession-application/:applicationId/approve",adminController.approveFeeConcessionApplication);
router.post("/fee-concession-application/:applicationId/reject",adminController.rejectFeeConcessioApplication);


module.exports = router;
