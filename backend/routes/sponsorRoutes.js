const express = require("express");
const router = express.Router();
const sponsorController = require("../controllers/sponsorController");
 
router.get("/recommended-students", sponsorController.getRecommendedStudents);



 
module.exports = router;
