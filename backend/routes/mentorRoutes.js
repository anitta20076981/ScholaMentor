const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
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
 

router.put(
  "/update/:mentorId",
  upload.fields([
    // { name: "profile_photo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "certificates", maxCount: 1 },
    { name: "id_proof", maxCount: 1 },
  ]),
  mentorController.updateMentorDetails
);
router.get("/get-details/:mentorId", mentorController.getMentorDetails);
router.get("/get-subjects", mentorController.getAllSubjects);

// router.get("/get-all-student-requests/:sponsorId", sponsorController.getAllStudentRequest);
// router.get("/get-student-request/:sponsorId/:requestId", sponsorController.getStudentRequest);
// router.post("/request-more-info/:sponsorId/:requestId", sponsorController.requestMoreInfo);

// router.get("/:sponsorId/notifications", sponsorController.getNotifications);

// router.get("/get-info-request/:sponsorId/:requestId", sponsorController.getInfoRequest);
// router.get("/get-submitted-docs/:sponsorId/:requestId", sponsorController.getSubmittedDocs);
// router.post("/approve-sponsorship/:sponsorId/:requestId", sponsorController.approveSponsorship);
// router.get("/get-approved-requested/:sponsorId", sponsorController.getApprovedSponsorship);


 
module.exports = router;
