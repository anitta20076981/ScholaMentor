const express = require("express");
const router = express.Router();
const sponsorController = require("../controllers/sponsorController");
 
router.get("/recommended-students", sponsorController.getRecommendedStudents);
router.get("/get-student-request/:sponsorId/:requestId", sponsorController.getStudentRequest);

 

 
module.exports = router;
