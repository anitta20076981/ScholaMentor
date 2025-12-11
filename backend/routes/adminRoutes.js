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
router.post("/delete-feeconcession-application/:applicationId",adminController.deleteFeeConcessionpApplication);

router.get("/scholarship-settings", adminController.getScholarshipSettings);
router.patch("/scholarship-settings/:id/toggle", adminController.toggleScholarshipSetting);

router.get("/get-all-sponsorship-request", adminController.getAllSponsorshipRequest);
router.get("/get-sponsorship-request/:applicationId", adminController.getSponsorshipRequestById);
router.post("/sponsorship-application/:applicationId/approve",adminController.approveSponsorshipRequest);
router.post("/sponsorship-application/:applicationId/reject",adminController.rejectSponsorshipRequest);

router.get("/mentor_list", adminController.getAllMentor);
router.get("/view-mentor/:mentorId", adminController.getMentorById);

router.get("/sponsor_list", adminController.getAllSponsors);


router.put("/approve-mentor/:mentorId",adminController.approveMentor);
router.get("/mentorship_request", adminController.getAllMentorshipRequests);
router.get("/view-mentorship-request/:studentId/:mentorId", adminController.viewMentorshipRequest);
router.put("/approve-mentorship-request/:mentorId/:studentId", adminController.approveMentorshipRequest);

router.get("/view-sponsor/:sponsorId", adminController.getSponsorById);
router.post("/approve-sponsor/:sponsorId/approve",adminController.approveSponsor);

router.delete("/delete-mentor/:mentorId",adminController.deleteMentor);

router.get("/view-student/:studentId", adminController.getStudentById);
router.delete("/delete-student/:studentId",adminController.deleteStudent);


module.exports = router;
