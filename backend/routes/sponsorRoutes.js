const express = require("express");
const router = express.Router();
const sponsorController = require("../controllers/sponsorController");
 
router.get("/recommended-students", sponsorController.getRecommendedStudents);
router.get("/get-all-student-requests/:sponsorId", sponsorController.getAllStudentRequest);
router.get("/get-student-request/:sponsorId/:requestId", sponsorController.getStudentRequest);
router.post("/request-more-info/:sponsorId/:requestId", sponsorController.requestMoreInfo);

router.get("/:sponsorId/notifications", sponsorController.getNotifications);
router.put("/notifications/read/:notificationId", sponsorController.notificationMarkAsRead);

router.get("/get-info-request/:sponsorId/:requestId", sponsorController.getInfoRequest);
router.get("/get-submitted-docs/:sponsorId/:requestId", sponsorController.getSubmittedDocs);
router.post("/approve-sponsorship/:sponsorId/:requestId", sponsorController.approveSponsorship);
router.get("/get-approved-requested/:sponsorId", sponsorController.getApprovedSponsorship);


 
module.exports = router;
