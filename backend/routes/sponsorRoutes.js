const express = require("express");
const router = express.Router();
const sponsorController = require("../controllers/sponsorController");
const multer = require("multer");//this packeg for uplaod image

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
 
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
router.get("/get-details/:sponsorId", sponsorController.getSponsorDetails);

router.put(
  "/update/:sponsorId",
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "gov_id", maxCount: 1 },
    { name: "income_certificate", maxCount: 1 },
    { name: "bank_statement", maxCount: 1 },
  ]),
  sponsorController.updateSponsorDetails
);

 
module.exports = router;
